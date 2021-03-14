import React from 'react';
import driveClient from '../../DriveClient';
import { AlbumIndexEntry } from '../../photos';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import AlbumCover from './AlbumCover';
import Page from '../Page';
import './Photos.css';

const titleBar: TitleBarProps = {
    color: '#FCD872',
    image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==',
    title: 'Your Photos',
    subtitle: 'Photos you\'ve uploaded and shared'
};

const data: InfiniteScrollerProps = {
    fetchRequests: [() => driveClient.getAlbumFiles()],
    pageSize: 10,
    renderItem: (a: AlbumIndexEntry) => <AlbumCover { ...a } />
};

export default function Photos() {
    return <Page titleBar={titleBar} infiniteScroller={data} />;
}
