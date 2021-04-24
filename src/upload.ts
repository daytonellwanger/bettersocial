import JSZip from 'jszip';
import { Album, AlbumIndex } from './contracts/photos';
import { Conversation, ConversationIndex } from './contracts/messages';
import { requestQueue } from './requests';
import { mainFolderName } from './DriveClient';

export async function uploadFiles(zip: JSZip, uploadListener: (progress: number, message: string) => void) {
    let totalFiles = 0;
    let uploadedFiles = 0;
    const fileUploadListener = () => {
        uploadedFiles++;
        const progress = (uploadedFiles / totalFiles) * .95;
        uploadListener(progress, `Uploading files: ${uploadedFiles + 1}/${totalFiles}`);
    }
    const rootFolder = new Folder(mainFolderName, ['posts', 'comments', 'messages', 'photos_and_videos'], fileUploadListener);
    zip.forEach((relativePath, file) => {
        if (file.dir) {
            return;
        }
        rootFolder.addFile(relativePath, file, false);
    });
    totalFiles = rootFolder.getNumFiles();
    uploadListener(0, `Uploading files: 1/${totalFiles}`);
    const failedUploads = await rootFolder.upload();
    if (failedUploads.length > 0) {
        return failedUploads;
    }
    uploadListener(.97, 'Creating conversation index');
    await createConversationIndex(rootFolder);
    uploadListener(.99, 'Creating album index');
    await createAlbumIndex(rootFolder);
    uploadListener(1, 'Done');
}

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
        const result = new Promise<XMLHttpRequest>((resolve, reject) => { resolvePromise = resolve; });
        xhr.onload = () => {
            resolvePromise(xhr);
        };
        xhr.send(form);
        return result;
    });
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

    public async upload(parentId?: string) {
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
        const uploadPromises: Promise<any>[] = [];
        let failedUploads: FileUploadFailure[] = [];
        for (let childFolder of this.folders) {
            uploadPromises.push(childFolder.upload(this.id).then((failures) => failedUploads = failedUploads.concat(failures)));
        }

        const uploadFileFunction = async (data: FileData) => {
            const content = await data.file.zip.async('blob');
            try {
                const result = await uploadFile(data.file.name, data.parentId, content);
                data.file.id = result.response.id;
                if (this.uploadListener) {
                    this.uploadListener();
                }
            } catch (e) {
                failedUploads.push({ ...data, failureReason: e });
            }
        };
        for (let file of this.files) {
            uploadPromises.push(uploadFileFunction({ file, parentId: this.id }));
        }
        await Promise.all(uploadPromises);
        return failedUploads;
    }

}

type FileData = {
    file: {
        id?: string,
        name: string,
        zip: JSZip.JSZipObject
    },
    parentId: string
};

export type FileUploadFailure = FileData & { failureReason: any };

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
