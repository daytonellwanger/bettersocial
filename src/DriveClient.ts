import { PostWithAttachment } from './contracts/posts';
import { AlbumIndex, AlbumIndexEntry, Video, VideosInfo } from './contracts/photos';
import { Comment } from './contracts/comments';
import { Conversation, ConversationFolder, ConversationIndex, MessagePlus } from './contracts/messages';
import { requestQueue } from './requests';

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

    private async getFilesFromRootFolder(folderName: string, fileName: string, exactFileName = false) {
        await this.init();

        const folder = this.root!.find(f => f.name === folderName);
        if (!folder) {
            throw new Error(`Could not find folder ${folderName}`);
        }
        if (!folder.id) {
            throw new Error(`${folderName} has no ID`);
        }

        const fileNameQuery = exactFileName 
                                ? `name="${fileName}"`
                                : `name contains "${fileName}"`;
        const files = (await gapi.client.drive.files.list({ q: `"${folder.id}" in parents and ${fileNameQuery}` })).result.files!;
        if (!files || files.length === 0) {
            throw new Error(`Could not find file ${fileName}`);
        }

        return files;
    }

    private async getRootFile(name: string) {
        await this.init();

        const file = this.root!.find(f => f.name === name)!;
        if (!file) {
            throw new Error(`Could not find file ${name}`);
        }

        const fileContents = (await gapi.client.drive.files.get({ fileId: file.id!, alt: 'media' })).result!;
        if (!fileContents) {
            throw new Error(`Could not read file ${name}`);
        }

        return fileContents;
    }

    public async getPosts() {
        const postsFiles = await this.getFilesFromRootFolder('posts', 'your_posts');
        return postsFiles.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
            return async () => {
                const posts = (await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as PostWithAttachment[];
                return posts;
            }
        });
    }

    public async getComments() {
        const commentsFiles = await this.getFilesFromRootFolder('comments', 'comments');
        return commentsFiles.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
            return async () => {
                const comments = ((await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as any).comments as Comment[];
                return comments;
            }
        });
    }

    public async getVideos(): Promise<VideosInfo> {
        const videosFiles = await this.getFilesFromRootFolder('photos_and_videos', 'your_videos.json', true);
        if (videosFiles.length > 1) {
            throw new Error('Found multiple videos files');
        }
        const videosFileId = videosFiles[0].id!;
        if (!videosFileId) {
            throw new Error('Videos file has no ID');
        }

        const photosAndVideosFolderId = this.root!.find(f => f.name === 'photos_and_videos')!.id!;
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

    public async getAlbumFiles(): Promise<AlbumIndexEntry[]> {
        const albumIndex = (await this.getRootFile('albumIndex.json')) as AlbumIndex;
        albumIndex.albums.sort((a, b) => b.timestamp - a.timestamp);
        return albumIndex.albums;
    }

    public async getConversationFolders(): Promise<ConversationFolder[]> {
        const conversationIndex = (await this.getRootFile('conversationIndex.json')) as ConversationIndex;
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

export async function getConversationsRequests(folderId: string): Promise<(() => Promise<MessagePlus[]>)[]> {
    const conversationPages = (await gapi.client.drive.files.list({ q: `"${folderId}" in parents and name contains 'message_'` })).result.files!;
    if (!conversationPages || conversationPages.length === 0) {
        throw new Error('Could not find conversation file');
    }

    const conversationsRequests = conversationPages.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
        return async () => {
            const conversation = (await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as Conversation;
            let myName = '';
            if (conversation.participants.length <= 3) {
                for (let participant of conversation.participants) {
                    if (conversation.title.indexOf(participant.name) < 0) {
                        myName = participant.name;
                        break;
                    }
                }
            }
            return conversation.messages.map(m => ({ ...m, fromSelf: m.sender_name === myName }));
        }
    });

    return conversationsRequests;
}

const driveClient = new DriveClient();
export default driveClient;
