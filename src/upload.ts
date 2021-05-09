import JSZip from 'jszip';
import { Album, AlbumIndex } from './contracts/photos';
import { Conversation, ConversationIndex } from './contracts/messages';
import { requestQueue } from './requests';
import { mainFolderName } from './DriveClient';

type FileData = {
    file: {
        id?: string,
        name: string,
        zip: JSZip.JSZipObject
    },
    parentId: string
};

type FileUploadFailure = FileData & { failureReason: any };

async function uploadFile(name: string, folderId: string, content: string | Blob) {
    const metadata = {
        name,
        parents: [folderId]
    };
    if (typeof content === 'string') {
        content = new Blob([content], { type: 'text/plain' });
    }

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', content);

    return requestQueue.request(() => {
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
        xhr.responseType = 'json';

        let resolvePromise: (value: XMLHttpRequest) => void;
        let rejectPromise: (reason: any) => void;
        const result = new Promise<XMLHttpRequest>((resolve, reject) => { resolvePromise = resolve; rejectPromise = reject; });
        xhr.onload = () => {
            resolvePromise(xhr);
        };
        xhr.onerror = () => {
            rejectPromise(JSON.stringify(xhr, null, 2));
        };
        xhr.send(form);
        return result;
    });
}

export async function unzipAndUploadFile(data: FileData, callback?: () => void): Promise<FileUploadFailure[] | undefined> {
    const content = await data.file.zip.async('blob');
    try {
        const result = await uploadFile(data.file.name, data.parentId, content);
        data.file.id = result.response.id;
        if (callback) {
            callback();
        }
    } catch (e) {
        return [{ ...data, failureReason: e }];
    }
}

export class Uploader {

    private totalFiles = 0;
    private uploadedFiles = 0;
    private rootFolder: Folder;
    private fileUploadListener: () => void;
    public failedUploads: FileUploadFailure[] = [];

    public constructor(private zips: JSZip[], private uploadListener: (progress: number, message: string) => void) {
        this.fileUploadListener = () => {
            this.uploadedFiles++;
            const progress = (this.uploadedFiles / this.totalFiles) * .95;
            this.uploadListener(progress, `Uploading files: ${this.uploadedFiles + 1}/${this.totalFiles}`);
        }
        this.rootFolder = new Folder(mainFolderName, ['posts', 'comments', 'messages', 'photos_and_videos'], this.fileUploadListener);
    }

    public preUpload(): boolean {
        const requiredFiles = ['posts/your_posts_1.json', 'comments/comments.json', 'photos_and_videos/album/0.json'];
        let hadRequiredFile = false;
        this.zips.forEach((zip) => {
            zip.forEach((relativePath, file) => {
                if (file.dir) {
                    return;
                }
                if (requiredFiles.indexOf(relativePath) >= 0) {
                    hadRequiredFile = true;
                }
                this.rootFolder!.addFile(relativePath, file, false);
            });
        });
        return hadRequiredFile;
    }

    public async upload(): Promise<boolean> {
        this.totalFiles = this.rootFolder!.getNumFiles();
        this.uploadListener(0, `Uploading files: 1/${this.totalFiles}`);
        this.failedUploads = await this.rootFolder.upload();
        if (this.failedUploads.length > 0) {
            return false;
        }
        await this.finishUpload();
        return true;
    }

    public async retryFailedFiles(): Promise<boolean> {
        const uploadPromises: Promise<FileUploadFailure[] | undefined>[] = [];
        this.failedUploads.forEach(failedUpload => uploadPromises.push(unzipAndUploadFile(failedUpload, this.fileUploadListener)));
        const uploadResults = await Promise.all(uploadPromises);
        this.failedUploads = [];
        uploadResults.filter(result => !!result).forEach(result => this.failedUploads = this.failedUploads.concat(result!));
        if (this.failedUploads.length > 0) {
            return false;
        }
        await this.finishUpload();
        return true;
    }

    public async finishUpload() {
        this.uploadListener(.97, 'Creating conversation index');
        await createConversationIndex(this.rootFolder);
        this.uploadListener(.99, 'Creating album index');
        await createAlbumIndex(this.rootFolder);
        this.uploadListener(1, 'Done');
    }

}

async function createAlbumIndex(root: Folder) {
    const albumIndex: AlbumIndex = {
        albums: []
    };

    const albums = root.folders.find(f => f.name === 'photos_and_videos')?.folders.find(f => f.name === 'album')?.files!;
    if (!albums) {
        // complain
        return;
    }

    for (let albumFile of albums) {
        const content = await albumFile.zip.async('string');
        const album: Album = JSON.parse(content);
        albumIndex.albums.push({
            id: albumFile.id!,
            name: album.name,
            numPhotos: album.photos.length,
            photo: album.cover_photo.uri,
            timestamp: album.last_modified_timestamp
        });
    }

    await uploadFile('albumIndex.json', root.id!, JSON.stringify(albumIndex, null, 2));
}

async function createConversationIndex(root: Folder) {
    const conversationIndex: ConversationIndex = {
        conversations: []
    };

    const inbox = root.folders.find(f => f.name === 'messages')?.folders.find(f => f.name === 'inbox')?.folders!;
    if (!inbox) {
        // complain
        return;
    }

    for (let conversationFolder of inbox) {
        const conversationFile = conversationFolder.files.find(f => f.name === 'message_1.json')!;
        if (!conversationFile) {
            // complain
            continue;
        }
        const content = await conversationFile.zip.async('string');
        const conversation: Conversation = JSON.parse(content);
        conversationIndex.conversations.push({ folderId: conversationFolder.id!, title: conversation!.title });
    }

    await uploadFile('conversationIndex.json', root.id!, JSON.stringify(conversationIndex, null, 2));
}

class Folder {

    public readonly folders: Folder[];
    public readonly files: { id?: string, name: string, zip: JSZip.JSZipObject }[] = [];
    public id: string | undefined;

    public constructor(public readonly name: string, folders: string[] = [], private uploadListener?: () => void) {
        this.folders = folders.map(folderName => new Folder(folderName, undefined, uploadListener));
    }

    public getNumFiles() {
        let numFiles = this.files.length + 1;
        for (let folder of this.folders) {
            numFiles += folder.getNumFiles();
        }
        return numFiles;
    }

    public addFile(relativePath: string, file: JSZip.JSZipObject, createTopFolder = true) {
        const pathPieces = relativePath.split('/');
        if (pathPieces.length === 1) {
            this.files.push({ name: pathPieces[0], zip: file });
            return;
        }

        const topFolderName = pathPieces[0];
        let folder = this.folders.find(f => f.name === topFolderName);
        if (!folder) {
            if (!createTopFolder) {
                return;
            }
            folder = new Folder(topFolderName, undefined, this.uploadListener);
            this.folders.push(folder);
        }

        folder.addFile(relativePath.substr(topFolderName.length + 1), file);
    }

    public async upload(parentId?: string): Promise<FileUploadFailure[]> {
        const resource: gapi.client.drive.File = {
            name: this.name,
            mimeType: 'application/vnd.google-apps.folder'
        };
        if (parentId) {
            resource.parents = [parentId];
        }
        const result = (await requestQueue.request(() => gapi.client.drive.files.create({ resource }))).result;
        if (this.uploadListener) {
            this.uploadListener();
        }
        this.id = result.id!;
        const uploadPromises: Promise<FileUploadFailure[] | undefined>[] = [];
        let failedUploads: FileUploadFailure[] = [];
        this.folders.forEach(childFolder => uploadPromises.push(childFolder.upload(this.id)));
        this.files.forEach(file => uploadPromises.push(unzipAndUploadFile({ file, parentId: this.id! }, this.uploadListener)));
        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.filter(result => !!result).forEach(result => failedUploads = failedUploads.concat(result!));
        return failedUploads;
    }

}
