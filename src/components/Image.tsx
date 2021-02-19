import React from 'react';
import { MediaAttachmentData } from '../Posts';
import { getPhotoData, PhotoData } from '../util';
import './Image.css';

interface P {
    data: MediaAttachmentData;
}

export default class Image extends React.Component<P, PhotoData> {

    state: PhotoData = {
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
