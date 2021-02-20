import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';
import { Album as AlbumData, Photo } from '../../photos';
import Image from '../util/Image';
import { getTimeString } from '../../util';

const pageSize = 10;

interface P {
    location: {
        state: {
            album: AlbumData
        }
    }
}

interface S {
    photos: Photo[],
    loadedPhotos: Photo[]
}

export default class Album extends React.Component<P> {

    state: S = {
        photos: this.props.location.state.album.photos,
        loadedPhotos: this.props.location.state.album.photos.slice(0, Math.min(pageSize, this.props.location.state.album.photos.length))
    };

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#FCD872' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">{this.props.location.state.album.name}</div>
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
            <InfiniteScroll
                dataLength={this.state.loadedPhotos.length}
                next={() => {
                    const loadedPhotos = this.state.loadedPhotos.concat(
                        this.state.photos.slice(
                            this.state.loadedPhotos.length,
                            Math.min(this.state.loadedPhotos.length + pageSize, this.state.photos.length)
                        )
                    );
                    this.setState({ ...this.state, loadedPhotos });
                }}
                hasMore={this.state.photos.length > this.state.loadedPhotos.length}
                loader={
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                        <PulseLoader color="#7086ff" size={10} />
                    </div>
                }
            >
                {this.state.loadedPhotos.map((p, idx) => (
                    <div key={idx}>
                        {this.renderPhoto(p)}
                    </div>
                ))}
            </InfiniteScroll>
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
