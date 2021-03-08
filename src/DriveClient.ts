import JSZip from 'jszip';
import { PostWithAttachment } from './posts';
import { Album, AlbumIndex, AlbumIndexEntry, Video } from './photos';
import { Comment } from './comments';
import { Conversation, ConversationFolder, ConversationIndex } from './messages';

const mainFolderName = 'facebook-data';

class DriveClient {

    private initPromise: Promise<void> | undefined;
    private root: gapi.client.drive.File[] | undefined;

    public async init() {
        if (!this.initPromise) {
            this.initPromise = new Promise<void>(async (resolve, reject) => {
                const mainFolder = (await gapi.client.drive.files.list({ q: `mimeType = 'application/vnd.google-apps.folder' and name = '${mainFolderName}'` })).result.files!;
                if (!mainFolder || mainFolder.length === 0) {
                    reject(`Could not find folder with name '${mainFolderName}'`);
                    return;
                }
                if (mainFolder.length > 1) {
                    reject(`Found multiple folders with name '${mainFolderName}'`);
                    return;
                }
                const mainFolderId = mainFolder[0].id;
                if (!mainFolderId) {
                    reject(`Folder '${mainFolderName}' has no ID`);
                }

                this.root = (await gapi.client.drive.files.list({ q: `"${mainFolderId}" in parents` })).result.files!;
                if (!this.root) {
                    reject(`'${mainFolderName}' has no children`);
                    return;
                }

                resolve();
            });
        }
        return this.initPromise;
    }

    public async getPosts() {
        await this.init();

        const postsFolder = this.root!.find(f => f.name === 'posts');
        if (!postsFolder) {
            throw new Error('Could not find posts folder');
        }
        if (!postsFolder.id) {
            throw new Error('Posts folder has no ID');
        }
        const postsFolderId = postsFolder.id;

        const postsFile = (await gapi.client.drive.files.list({ q: `"${postsFolderId}" in parents and name contains 'your_posts'` })).result.files!;
        if (!postsFile || postsFile.length === 0) {
            throw new Error('Posts folder has no children');
        }
        if (postsFile.length > 1) {
            throw new Error('Posts folder has multiple children');
        }
        const postsFileId = postsFile[0].id!;
        if (!postsFileId) {
            throw new Error('Posts file has no ID');
        }
        const posts = (await gapi.client.drive.files.get({ fileId: postsFileId, alt: 'media' })).result as PostWithAttachment[];
        return posts;
    }

    public async getAlbumFiles(): Promise<AlbumIndexEntry[]> {
        await this.init();

        const albumIndexFile = this.root!.find(f => f.name === 'albumIndex.json')!;
        if (!albumIndexFile) {
            throw new Error('Could not find album index');
        }

        const albumIndex = (await gapi.client.drive.files.get({ fileId: albumIndexFile.id!, alt: 'media' })).result! as AlbumIndex;
        if (!albumIndex) {
            throw new Error('Could not read album index');
        }

        albumIndex.albums.sort((a, b) => b.timestamp - a.timestamp);
        return albumIndex.albums;
    }

    public async getVideos(): Promise<Video[]> {
        await this.init();

        const photosAndVideosFolder = this.root!.find(f => f.name === 'photos_and_videos');
        if (!photosAndVideosFolder) {
            throw new Error('Could not find photos folder');
        }
        if (!photosAndVideosFolder.id) {
            throw new Error('Photos folder has no ID');
        }
        const photosAndVideosFolderId = photosAndVideosFolder.id;

        const videosFiles = (await gapi.client.drive.files.list({ q: `"${photosAndVideosFolderId}" in parents and name="your_videos.json"` })).result.files!;
        if (!videosFiles || videosFiles.length === 0) {
            throw new Error('Could not find videos file');
        }
        if (videosFiles.length > 1) {
            throw new Error('Found multiple videos files');
        }
        const videosFileId = videosFiles[0].id!;
        if (!videosFileId) {
            throw new Error('Videos file has no ID');
        }

        const videos = ((await gapi.client.drive.files.get({ fileId: videosFileId, alt: 'media' })).result as any).videos as Video[];
        return videos;
    }

    public async getComments(): Promise<Comment[]> {
        await this.init();

        const commentsFolder = this.root!.find(f => f.name === 'comments');
        if (!commentsFolder) {
            throw new Error('Could not find comments folder');
        }
        if (!commentsFolder.id) {
            throw new Error('Comments folder has no ID');
        }
        const commentsFolderId = commentsFolder.id;

        const commentsFiles = (await gapi.client.drive.files.list({ q: `"${commentsFolderId}" in parents and name="comments.json"` })).result.files!;
        if (!commentsFiles || commentsFiles.length === 0) {
            throw new Error('Could not find comments file');
        }
        if (commentsFiles.length > 1) {
            throw new Error('Found multiple comments files');
        }
        const commentsFileId = commentsFiles[0].id!;
        if (!commentsFileId) {
            throw new Error('Comments file has no ID');
        }

        const comments = ((await gapi.client.drive.files.get({ fileId: commentsFileId, alt: 'media' })).result as any).comments as Comment[];
        return comments;
    }

    public async getConversationFolders(): Promise<ConversationFolder[]> {
        await this.init();

        const conversationIndexFile = this.root!.find(f => f.name === 'conversationIndex.json')!;
        if (!conversationIndexFile) {
            throw new Error('Could not find conversation index');
        }

        const conversationIndex = (await gapi.client.drive.files.get({ fileId: conversationIndexFile.id!, alt: 'media' })).result as ConversationIndex;
        if (!conversationIndex) {
            throw new Error('Could not read conversation index');
        }

        return conversationIndex.conversations.map(c => (
            {
                name: c.title,
                id: c.folderId
            }
        )).sort((a, b) => a.name.localeCompare(b.name));
    }

    public async uploadFiles(zip: JSZip) {
        const rootFolder = new Folder(mainFolderName, ['posts', 'comments', 'messages', 'photos_and_videos']);
        zip.forEach((relativePath, file) => {
            if (file.dir) {
                return;
            }
            rootFolder.addFile(relativePath, file, false);
        });
        await rootFolder.upload();
        await createConversationIndex(rootFolder);
        await createAlbumIndex(rootFolder);
    }

}

async function uploadFile(name: string, folderId: string, content: string | Blob) {
    let mimeType = 'text/plain';
    if (name.endsWith('.jpg')) {
        mimeType = 'image/jpeg';
    }
    const metadata = {
        name,
        mimeType,
        parents: [folderId]
    };
    if (typeof content === 'string') {
        content = new Blob([content], { type: 'text/plain' });
    }

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', content);

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
}

class Folder {

    public readonly folders: Folder[];
    public readonly files: { id?: string, name: string, zip: JSZip.JSZipObject }[] = [];
    public id: string | undefined;

    public constructor(public readonly name: string, folders: string[] = []) {
        this.folders = folders.map(folderName => new Folder(folderName));
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
            folder = new Folder(topFolderName);
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
        const result = (await gapi.client.drive.files.create({ resource })).result;
        this.id = result.id!;
        for (let childFolder of this.folders) {
            await childFolder.upload(this.id);
        }
        for (let file of this.files) {
            const content = await file.zip.async('blob');
            const result = await uploadFile(file.name, this.id, content);
            file.id = result.response.id;
        }
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

const driveClient = new DriveClient();
export default driveClient;
