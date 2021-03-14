import React from 'react';
import driveClient from '../../DriveClient';
import { Video } from '../../photos';
import { decodeString, getTimeString } from '../../util';
import ContentContainer from '../ContentContainer';
import Image from '../util/Image';
import InfiniteScroller from '../util/InfiniteScroller';
import TitleBar from '../util/TitleBar';

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

    renderTopBar() {
        return <TitleBar
                    color="#FCD872"
                    image="iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg=="
                    title="Your Videos"
                    subtitle="Videos you've uploaded and shared"
                    externalLink={this.state.folderLink} />;
    }

    renderVideo(video: Video) {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                <div className="_3-96 _2let">
                    <Image uri={video.uri} link={true} />
                    <div className="_3-95">{decodeString(video.description)}</div>
                </div>
                <div className="_3-94 _2lem">{getTimeString(video.creation_timestamp)}</div>
            </div>
        );
    }

    renderBody() {
        return (
            <InfiniteScroller
                    fetchRequests={[() => this.fetchVideos()]}
                    pageSize={10}
                    renderItem={(video: Video) => this.renderVideo(video)} />
        );
    }

    render() {
        return (
            <ContentContainer>
                {this.renderTopBar()}
                {this.renderBody()}
            </ContentContainer>
        );
    }

}
