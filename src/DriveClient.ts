import { MediaAttachmentData, PostWithAttachment } from './Posts';

const mainFolderName = 'facebookdata';

class DriveClient {

    private initPromise: Promise<void> | undefined;
    private topicFolders: gapi.client.drive.File[] | undefined;

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

                this.topicFolders = (await gapi.client.drive.files.list({ q: `mimeType = 'application/vnd.google-apps.folder' and "${mainFolderId}" in parents` })).result.files!;
                if (!this.topicFolders) {
                    reject(`'${mainFolderName}' has no child folders`);
                    return;
                }

                resolve();
            });
        }
        return this.initPromise;
    }

    public async getPosts() {
        await this.init();

        const postsFolder = this.topicFolders!.find(f => f.name === 'posts');
        if (!postsFolder) {
            throw new Error('Could not find posts folder');
        }
        if (!postsFolder.id) {
            throw new Error('Posts folder has no ID');
        }
        const postsFolderId = postsFolder.id;

        const postsFile = (await gapi.client.drive.files.list({ q: `"${postsFolderId}" in parents` })).result.files!;
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

        await downloadPostPhotos(posts);
        return posts;
    }

}

async function downloadPostPhotos(posts: PostWithAttachment[]) {
    // TODO download photos in parallel
    // TODO return posts immediately and do photo download in background
    for (let p of posts) {
        const pwa = p as PostWithAttachment;
        if (pwa.attachments) {
            for (let a of pwa.attachments) {
                for (let d of a.data) {
                    let mad = d as MediaAttachmentData;
                    if (mad.media && mad.media.uri) {
                        mad.media.content = await downloadPhoto(mad.media.uri);
                    }
                }
            }
        }
    }
}

async function downloadPhoto(uri: string): Promise<string> {
    const uriPieces = uri.split('/');
    const fileName = uriPieces[uriPieces.length - 1];
    const photoFile = (await gapi.client.drive.files.list({ q: `name = '${fileName}'` })).result.files!;
    if (!(photoFile && photoFile.length === 1)) {
        return '';
    }
    const photoFileId = photoFile[0].id!;
    if (!photoFileId) {
        return '';
    }
    const photo = await gapi.client.drive.files.get({ fileId: photoFileId, alt: 'media' });
    return photo.body;
}

const driveClient = new DriveClient();
export default driveClient;
