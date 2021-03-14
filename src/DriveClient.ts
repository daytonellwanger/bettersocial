import { requestQueue } from './requests';
import { PostWithAttachment } from './contracts/posts';
import { AlbumIndex, AlbumIndexEntry, Video, VideosInfo } from './contracts/photos';
import { Comment } from './contracts/comments';
import { ConversationFolder, ConversationIndex } from './contracts/messages';

export const mainFolderName = 'facebook-data';

class DriveClient {

    private initPromise: Promise<void> | undefined;
    private root: gapi.client.drive.File[] | undefined;

    public async init(force = false) {
        if (!this.initPromise || force) {
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

        const postsFiles = (await gapi.client.drive.files.list({ q: `"${postsFolderId}" in parents and name contains 'your_posts'` })).result.files!;
        if (!postsFiles || postsFiles.length === 0) {
            throw new Error('Posts folder has no children');
        }

        return postsFiles.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
            return async () => {
                const posts = (await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as PostWithAttachment[];
                return posts;
            }
        });
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

    public async getVideos(): Promise<VideosInfo> {
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

        let videosFolderLink: string | undefined;
        const videosFolder = (await gapi.client.drive.files.list({ q: `mimeType = 'application/vnd.google-apps.folder' and "${photosAndVideosFolderId}" in parents and name="videos"` })).result.files!;
        if (videosFolder && videosFolder.length === 1 && videosFolder[0].id) {
            videosFolderLink = (await requestQueue.request(() => gapi.client.drive.files.get({ fileId: videosFolder[0].id!, fields: 'webViewLink' }))).result.webViewLink!;
        }

        const videos = ((await gapi.client.drive.files.get({ fileId: videosFileId, alt: 'media' })).result as any).videos as Video[];
        return {
            videos,
            videosFolderLink
        };
    }

    public async getComments() {
        await this.init();

        const commentsFolder = this.root!.find(f => f.name === 'comments');
        if (!commentsFolder) {
            throw new Error('Could not find comments folder');
        }
        if (!commentsFolder.id) {
            throw new Error('Comments folder has no ID');
        }
        const commentsFolderId = commentsFolder.id;

        const commentsFiles = (await gapi.client.drive.files.list({ q: `"${commentsFolderId}" in parents and name contains "comments"` })).result.files!;
        if (!commentsFiles || commentsFiles.length === 0) {
            throw new Error('Could not find comments file');
        }

        return commentsFiles.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
            return async () => {
                const comments = ((await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as any).comments as Comment[];
                return comments;
            }
        });
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

}

export interface PhotoData {
    content: string;
    webViewLink: string;
    thumbnailLink: string;
    parentFolderLink?: string;
};

export async function getPhotoData(uri: string, includeParentFolderLink = false): Promise<PhotoData | undefined> {
    const uriPieces = uri.split('/');
    const fileName = uriPieces[uriPieces.length - 1];
    const photoFile = (await requestQueue.request(() => gapi.client.drive.files.list({ q: `name = '${fileName}'` }))).result.files!;
    if (!(photoFile && photoFile.length === 1)) {
        return;
    }
    const photoFileId = photoFile[0].id!;
    if (!photoFileId) {
        return;
    }
    // TODO: run these in parallel?
    let photoContent = '';
    if (fileName.endsWith('jpg')) {
        photoContent = (await requestQueue.request(() => gapi.client.drive.files.get({ fileId: photoFileId, alt: 'media' }))).body;
    }
    const photoInfo = (await requestQueue.request(() => gapi.client.drive.files.get({ fileId: photoFileId, fields: 'webViewLink, thumbnailLink, parents' }))).result;

    let parentFolderLink: string | undefined;
    if (includeParentFolderLink) {
        parentFolderLink = (await requestQueue.request(() => gapi.client.drive.files.get({ fileId: photoInfo.parents![0], fields: 'webViewLink' }))).result.webViewLink!;
    }
    return {
        content: photoContent,
        webViewLink: photoInfo.webViewLink!,
        thumbnailLink: photoInfo.thumbnailLink!,
        parentFolderLink
    };
}

export interface FileData {
    name: string;
    webViewLink: string;
    iconLink: string;
};

export async function getFileData(uri: string): Promise<FileData | undefined> {
    const uriPieces = uri.split('/');
    const fileName = uriPieces[uriPieces.length - 1];
    const file = (await requestQueue.request(() => gapi.client.drive.files.list({ q: `name = '${fileName}'` }))).result.files!;
    if (!(file && file.length === 1)) {
        return;
    }
    const fileId = file[0].id!;
    if (!fileId) {
        return;
    }
    const fileInfo = (await requestQueue.request(() => gapi.client.drive.files.get({ fileId, fields: 'name, webViewLink, iconLink' }))).result;
    return {
        name: fileInfo.name!,
        webViewLink: fileInfo.webViewLink!,
        iconLink: fileInfo.iconLink!
    };
}

const driveClient = new DriveClient();
export default driveClient;
