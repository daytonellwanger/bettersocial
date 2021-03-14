import React from 'react';
import driveClient from '../../DriveClient';
import { Video as VideoData } from '../../contracts/photos';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import Page from '../Page';
import Video from './Video';

interface S {
    folderLink?: string;
}

export default class Videos extends React.Component<{}, S> {

    state: S = {};

    async fetchVideos() {
        const videosInfo = (await driveClient.getVideos())!;
        this.setState({ folderLink: videosInfo.videosFolderLink });
        return videosInfo.videos;
    }

    render() {
        const titleBar: TitleBarProps = {
            color: '#FCD872',
            image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==',
            title: 'Your Videos',
            subtitle: 'Videos you\'ve uploaded and shared',
            externalLink: this.state.folderLink
        };
        const data: InfiniteScrollerProps = {
            fetchRequests: [() => this.fetchVideos()],
            pageSize: 10,
            renderItem: (video: VideoData) => <Video { ...video } />
        };
        return <Page titleBar={titleBar} data={data} />;
    }

}
