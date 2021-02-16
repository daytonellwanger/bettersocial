import React from 'react';
import { MediaAttachmentData } from '../Posts';
import './Image.css';

interface P {
    data: MediaAttachmentData;
}

interface S {
    content: string;
    webViewLink: string;
    thumbnailLink: string;
}

export default class Image extends React.Component<P, S> {

    state: S = {
        content: '',
        webViewLink: '',
        thumbnailLink: ''
    }

    async componentDidMount() {
        const photoData = await getPhotoData(this.props.data.media.uri);
        if (photoData) {
            this.setState({ ...photoData });
        }
    }

    render() {
        if (this.state.webViewLink && !this.state.content) {
            return (
                <a href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                    <div className='video-thumbnail'>
                        <img src={this.state.thumbnailLink} className="_2yuc _3-96" />
                    </div>
                </a>
            );
        } else {
            return (
                <a href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                    <img src={`data:image/jpeg;base64,${btoa(this.state.content)}`} className="_2yuc _3-96" />
                </a>
            );
        }
    }

}

let getPhotoDataQueue: Promise<S | undefined> = Promise.resolve(undefined);

async function getPhotoData(uri: string): Promise<S | undefined> {
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
    return getPhotoDataQueue;
}
