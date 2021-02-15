import React from 'react';
import { MediaAttachmentData } from '../Posts';

interface P {
    data: MediaAttachmentData;
}

interface S {
    content: string;
    webViewLink: string;
}

export default class Image extends React.Component<P, S> {

    state: S = {
        content: '',
        webViewLink: ''
    }

    async componentDidMount() {
        const photoData = await getPhotoData(this.props.data.media.uri);
        if (photoData) {
            this.setState({ ...photoData });
        }
    }

    render() {
        return (
            <a href={this.state.webViewLink}>
                <img src={`data:image/jpeg;base64,${btoa(this.state.content)}`} className="_2yuc _3-96" />
            </a>
        );
    }

}

let getPhotoDataQueue: Promise<{ content: string, webViewLink: string } | undefined> = Promise.resolve(undefined);

async function getPhotoData(uri: string): Promise<{ content: string, webViewLink: string } | undefined> {
    getPhotoDataQueue = getPhotoDataQueue.then(async () => {
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
        const photoContent = (await gapi.client.drive.files.get({ fileId: photoFileId, alt: 'media' })).body;
        const photoInfo = (await gapi.client.drive.files.get({ fileId: photoFileId, fields: 'webViewLink' })).result;
        return {
            content: photoContent,
            webViewLink: photoInfo.webViewLink!
        };
    });
    return getPhotoDataQueue;
}
