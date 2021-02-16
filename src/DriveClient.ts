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

}

const driveClient = new DriveClient();
export default driveClient;