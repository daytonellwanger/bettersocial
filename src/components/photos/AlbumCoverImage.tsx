import React from 'react';
import { getPhotoData, PhotoData } from '../../util';

interface P {
    uri: string;
}

export default class AlbumCoverImage extends React.Component<P, PhotoData> {

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
        return (
            <img src={`data:image/jpeg;base64,${btoa(this.state.content)}`} className="_2yuc _3-96" />
        );
    }

}
