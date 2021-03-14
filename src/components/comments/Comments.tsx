import React from 'react';
import driveClient from '../../DriveClient';
import { Comment as CommentData } from '../../comments';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import Page from '../Page';
import Comment from './Comment';

const titleBar: TitleBarProps = {
    color: '#F7923B',
    image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhsBIAbc+avSAAAAjUlEQVQoz62ROw7CMBBEnxPCERDHCb3Pyl04QVJQBgkJUSBsHoUV8ZEcGnaaleYVs7NBlqcBYMeJhG9KjEQAxGhtekEcqsAkQUi0lQCZVRCWcobmxxH8B8hVNxfgXAWOpai+2kMsRWF0MKv68K5qcrKXGcBO1ZuTWxFbu+K8/qNXD27kU/PSenHv+tuWJ8EkvUiVqwYRAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTI3VDA5OjMyOjA2LTA4OjAw49wxUAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yN1QwOTozMjowNi0wODowMJKBiewAAAAASUVORK5CYII=',
    title: 'Comments',
    subtitle: 'Comments you\'ve posted'
};

const data: InfiniteScrollerProps = {
    getFetchRequests: async () => {
        const comments = (await driveClient.getComments())!;
        return comments;
    },
    fetchRequests: [],
    pageSize: 25,
    renderItem: (c: CommentData) => <Comment { ...c } />
};

export default class CommentsComponent extends React.Component {

    render() {
        return <Page titleBar={titleBar} infiniteScroller={data} />;
    }

}
