import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PulseLoader from 'react-spinners/PulseLoader';
import driveClient from '../DriveClient';
import AlbumCover from './AlbumCover';
import './Photos.css';

const pageSize = 10;

interface S {
    loading: boolean;
    albums: string[];
    loadedAlbums: string[];
    error?: string;
}

export default class Photos extends React.Component<{}, S> {

    state: S = {
        loading: true,
        albums: [],
        loadedAlbums: []
    }

    async componentDidMount() {
        try {
            const albums = (await driveClient.getAlbumFiles())!;
            const loadedAlbums = albums.slice(0, Math.min(pageSize, albums.length));
            this.setState({ loading: false, albums, loadedAlbums });
        } catch (e) {
            this.setState({ loading: false, error: JSON.stringify(e, null, 2) });
        }
    }

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#FCD872' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">Your Photos</div>
                    <div className="_3b0e">Photos you've uploaded and shared</div>
                </div>
            </div>
        );
    }

    renderAlbums() {
        if (this.state.loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                    <PulseLoader color="#7086ff" size={10} />
                </div>
            );
        }
        if (this.state.error) {
            return <p>{this.state.error}</p>
        }
        return (
            <InfiniteScroll
                dataLength={this.state.loadedAlbums.length}
                next={() => {
                    const loadedAlbums = this.state.loadedAlbums.concat(
                        this.state.albums.slice(
                            this.state.loadedAlbums.length,
                            Math.min(this.state.loadedAlbums.length + pageSize, this.state.albums.length)
                        )
                    );
                    this.setState({ ...this.state, loadedAlbums });
                }}
                hasMore={this.state.albums.length > this.state.loadedAlbums.length}
                loader={
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                        <PulseLoader color="#7086ff" size={10} />
                    </div>
                }
            >
                {this.state.loadedAlbums.map((a, idx) => (
                    <div key={idx}>
                        <AlbumCover id={a} />
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
                    {this.renderAlbums()}
                </div>
            </div>
        );
    }

}
