import moment from 'moment';
import { requestQueue } from './requests';

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
