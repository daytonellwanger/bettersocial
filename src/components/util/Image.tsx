import React from 'react';
import { getPhotoData, PhotoData } from '../../util';
import './Image.css';

interface P {
    uri: string;
    link?: boolean;
}

export default class Image extends React.Component<P, PhotoData> {

    state: PhotoData = {
        content: '',
        webViewLink: '',
        thumbnailLink: ''
    }

    async componentDidMount() {
        const photoData = await getPhotoData(this.props.uri);
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
            if (this.props.link) {
                return (
                    <a href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                        <img src={`data:image/jpeg;base64,${btoa(this.state.content)}`} className="_2yuc _3-96" />
                    </a>
                );
            } else {
                return (
                    <img src={`data:image/jpeg;base64,${btoa(this.state.content)}`} className="_2yuc _3-96" />
                );
            }
        }
    }

}
