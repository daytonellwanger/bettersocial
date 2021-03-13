import moment from 'moment';

export function getTimeString(timestamp: number) {
    return moment(timestamp * 1000).format('MMM Do, YYYY, h:mm A');
}

export function decodeString(raw: string) {
    const arr = [];
    for (var i = 0; i < raw.length; i++) {
        arr.push(raw.charCodeAt(i));
    }
    return Buffer.from(arr).toString('utf8');
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

async function executeWithExponentialBackoff(executeRequest: () => Promise<any>, delay = 1000, attemptNumber = 1): Promise<any> {
    if (attemptNumber === 6) {
        throw new Error('Could not upload'); 
    }
    let didThrow = false;
    let result: any;
    try {
        result = await executeRequest();
    } catch {
        didThrow = true;
    }
    if (didThrow || (typeof result.status === 'number' && result.status !== 200)) {
        await new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), delay);
        });
        attemptNumber++;
        delay = 2*delay;
        return executeWithExponentialBackoff(executeRequest, delay, attemptNumber);
    } else {
        return result;
    }
}

type PendingRequest = {
    executeRequest: () => Promise<any>,
    resolveResult: (result: any) => void
};

class RequestQueue {

    private static readonly maxParallelRequests = 25;
    private activeRequests = 0;
    private pendingRequests: PendingRequest[] = [];

    public async request<T>(executeRequest: () => Promise<T>): Promise<T> {
        if (this.activeRequests < RequestQueue.maxParallelRequests) {
            this.activeRequests++;
            const result = await executeWithExponentialBackoff(executeRequest);
            this.activeRequests--;
            this.processNextRequest();
            return result;
        } else {
            let resolveResult: (result: any) => void;
            const result = new Promise<any>((resolve, reject) => {
                resolveResult = resolve;
            });
            const pendingRequest: PendingRequest = {
                executeRequest,
                resolveResult: resolveResult!
            }
            this.pendingRequests.push(pendingRequest);
            return result;
        }
    }

    private async processNextRequest() {
        if (this.pendingRequests.length === 0) {
            return;
        }
        const nextRequest = this.pendingRequests.splice(0, 1)[0];
        const result = await this.request(nextRequest.executeRequest);
        nextRequest.resolveResult(result);
    }

}

export const requestQueue = new RequestQueue();
