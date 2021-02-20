import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeString } from '../../util';
import { Album } from '../../photos';
import AlbumCoverImage from './AlbumCoverImage';

interface P {
    id: string;
}

interface S {
    album?: Album;
}

export default class AlbumCover extends React.Component<P, S> {

    state: S = {}

    async componentDidMount() {
        const album = await getAlbum(this.props.id);
        if (album) {
            this.setState({ album });
        }
    }

    renderBody() {
        if (this.state.album) {
            return (
                <div>
                    <div className="_3-96 _2pio _2lek _2lel">{this.state.album.name} - {this.state.album.photos.length} photo{this.state.album.photos.length === 1 ? '' : 's'}</div>
                    <div className="_3-96 _2let">
                        <Link to={{ pathname: '/album', state: { album: this.state.album } }}>
                            <AlbumCoverImage uri={this.state.album.cover_photo.uri} />
                        </Link>
                    </div>
                    <div className="_3-94 _2lem">{getTimeString(this.state.album.last_modified_timestamp)}</div>
                </div>
            );
        } else {
            return <img src="/empty-album.png" />
        }
    }

    render() {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                {this.renderBody()}
            </div>
        );
    }

}

let getAlbumQueue: Promise<Album | undefined> = Promise.resolve(undefined);
async function getAlbum(id: string): Promise<Album | undefined> {
    getAlbumQueue = getAlbumQueue.then(async () => {
        const album: Album = (await gapi.client.drive.files.get({ fileId: id, alt: 'media' })).result as Album;
        return album;
    });
    return getAlbumQueue;
}
