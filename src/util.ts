import moment from 'moment';

export function getTimeString(timestamp: number) {
    return moment(timestamp*1000).format('MMM Do, YYYY, h:mm A');
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
};

let getDataQueue: Promise<PhotoData | FileData | undefined> = Promise.resolve(undefined);
export async function getPhotoData(uri: string): Promise<PhotoData> {
    getDataQueue = getDataQueue.then(async () => {
        const uriPieces = uri.split('/');
        const fileName = uriPieces[uriPieces.length - 1];
        const photoFile = (await gapi.client.drive.files.list({ q: `name = '${fileName}'` })).result.files!;
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
            photoContent = (await gapi.client.drive.files.get({ fileId: photoFileId, alt: 'media' })).body;
        }
        const photoInfo = (await gapi.client.drive.files.get({ fileId: photoFileId, fields: 'webViewLink, thumbnailLink' })).result;
        return {
            content: photoContent,
            webViewLink: photoInfo.webViewLink!,
            thumbnailLink: photoInfo.thumbnailLink!
        };
    });
    return getDataQueue as Promise<PhotoData>;
}

export interface FileData {
    name: string;
    webViewLink: string;
    iconLink: string;
};

export async function getFileData(uri: string): Promise<FileData> {
    getDataQueue = getDataQueue.then(async () => {
        const uriPieces = uri.split('/');
        const fileName = uriPieces[uriPieces.length - 1];
        const file = (await gapi.client.drive.files.list({ q: `name = '${fileName}'` })).result.files!;
        if (!(file && file.length === 1)) {
            return;
        }
        const fileId = file[0].id!;
        if (!fileId) {
            return;
        }
        const fileInfo = (await gapi.client.drive.files.get({ fileId, fields: 'name, webViewLink, iconLink' })).result;
        return {
            name: fileInfo.name!,
            webViewLink: fileInfo.webViewLink!,
            iconLink: fileInfo.iconLink!
        };
    });
    return getDataQueue as Promise<FileData>;
}
