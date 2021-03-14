import React from 'react';
import { Album as AlbumData, Photo as PhotoData } from '../../photos';
import { getPhotoData } from '../../util';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import Page from '../Page';
import Photo from './Photo';

interface P {
    location: {
        state: {
            id: string;
            name: string;
        }
    }
}

interface S {
    folderLink?: string;
}

export default class Album extends React.Component<P, S> {

    state: S = {};

    private async fetchPhotos() {
        const album: AlbumData = (await gapi.client.drive.files.get({ fileId: this.props.location.state.id, alt: 'media' })).result as AlbumData;
        const folderLink = (await getPhotoData(album.cover_photo.uri, true))?.parentFolderLink!;
        this.setState({ folderLink });
        return album.photos;
    }

    render() {
        const titleBar: TitleBarProps = {
            color: '#FCD872',
            image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==',
            title: this.props.location.state.name,
            externalLink: this.state.folderLink
        };
        const data: InfiniteScrollerProps = {
            fetchRequests: [() => this.fetchPhotos()],
            pageSize: 10,
            renderItem: (p: PhotoData) => <Photo { ...p } />
        };
        return <Page titleBar={titleBar} data={data} />;
    }

}
