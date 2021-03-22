import React from 'react';
import { CardMedia, Link } from '@material-ui/core';
import { getPhotoData, PhotoData } from '../../DriveClient';
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
                <Link href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                    <CardMedia style={{ height: 0, paddingTop: '56.25%' }} className='video-thumbnail' image={this.state.thumbnailLink} />
                </Link>
            );
        } else {
            if (this.props.link) {
                return (
                    <Link href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                        <CardMedia
                            style={{ height: 0, paddingTop: '56.25%' }}
                            image={`data:image/jpeg;base64,${btoa(this.state.content)}`} />
                    </Link>
                );
            } else {
                return <CardMedia
                    style={{ height: 0, paddingTop: '56.25%' }}
                    image={`data:image/jpeg;base64,${btoa(this.state.content)}`} />;
            }
        }
    }

}
