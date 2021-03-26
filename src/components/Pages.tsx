import React from 'react';
import { Post as PostObject, PostWithAttachment } from '../contracts/posts';
import Post from './posts/Post';
import { Comment as CommentData } from '../contracts/comments';
import Comment from './comments/Comment';
import { P as InfiniteScrollerProps } from './util/InfiniteScroller';
import { P as TitleBarProps } from './util/TitleBar';
import driveClient from '../DriveClient';

export interface Page {
    titleBar: TitleBarProps;
    data: InfiniteScrollerProps;
}

export const posts: Page = {
    titleBar: {
        color: '#8C72CB',
        image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC',
        title: 'Your Posts'
    },
    data: {
        fetchRequests: [() => driveClient.getPosts()],
        pageSize: 25,
        renderItem: (p: PostObject | PostWithAttachment) => <Post { ...p } />
    }
};

export const comments: Page = {
    titleBar: {
        color: '#F7923B',
        image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhsBIAbc+avSAAAAjUlEQVQoz62ROw7CMBBEnxPCERDHCb3Pyl04QVJQBgkJUSBsHoUV8ZEcGnaaleYVs7NBlqcBYMeJhG9KjEQAxGhtekEcqsAkQUi0lQCZVRCWcobmxxH8B8hVNxfgXAWOpai+2kMsRWF0MKv68K5qcrKXGcBO1ZuTWxFbu+K8/qNXD27kU/PSenHv+tuWJ8EkvUiVqwYRAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTI3VDA5OjMyOjA2LTA4OjAw49wxUAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yN1QwOTozMjowNi0wODowMJKBiewAAAAASUVORK5CYII=',
        title: 'Comments',
        subtitle: 'Comments you\'ve posted'
    },
    data: {
        getFetchRequests: async () => {
            const comments = (await driveClient.getComments())!;
            return comments;
        },
        pageSize: 25,
        renderItem: (c: CommentData) => <Comment { ...c } />
    }
};
