import React from 'react';
import { Album as AlbumData, Photo } from '../../photos';
import Image from '../util/Image';
import { getPhotoData, getTimeString } from '../../util';
import InfiniteScroller from '../util/InfiniteScroller';

interface AlbumInfo {
    album?: AlbumData;
    albumFolderLink?: string;
}

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

    async fetchPhotos() {
        const album = await getAlbum(this.props.location.state.id);
        this.setState({ folderLink: album?.albumFolderLink });
        return album?.album?.photos || [];
    }

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#FCD872' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">{this.props.location.state.name}</div>
                    <a href={this.state.folderLink} target="_blank">View on Google</a>
                </div>
            </div>
        );
    }

    renderPhoto(photo: Photo) {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                <div className="_3-96 _2let">
                    <Image uri={photo.uri} link={true} />
                    {
                        photo.description
                            ? <div className="_3-95">{photo.description}</div>
                            : undefined
                    }
                </div>
                <div className="_3-94 _2lem">{getTimeString(photo.creation_timestamp)}</div>
            </div>
        );
    }

    renderBody() {
        return (
            <InfiniteScroller
                fetchRequests={[() => this.fetchPhotos()]}
                pageSize={10}
                renderItem={(p: Photo) => this.renderPhoto(p)} />
        );
    }

    render() {
        return (
            <div className="_3a_u">
                {this.renderTopBar()}
                <div className="_4t5n" role="main">
                    {this.renderBody()}
                </div>
            </div>
        );
    }

}

async function getAlbum(id: string): Promise<AlbumInfo> {
    const album: AlbumData = (await gapi.client.drive.files.get({ fileId: id, alt: 'media' })).result as AlbumData;
    const albumFolderLink = (await getPhotoData(album.cover_photo.uri, true))?.parentFolderLink!;
    return { album, albumFolderLink };
}
