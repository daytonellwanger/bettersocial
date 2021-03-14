import React from 'react';
import { Post as PostObject, PostWithAttachment } from '../contracts/posts';
import Post from './posts/Post';
import { AlbumIndexEntry } from '../contracts/photos';
import AlbumCover from './photos/AlbumCover';
import { Comment as CommentData } from '../contracts/comments';
import Comment from './comments/Comment';
import { ConversationFolder } from '../contracts/messages';
import ConversationTitle from './messages/ConversationTitle';
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
        getFetchRequests: () => driveClient.getPosts(),
        fetchRequests: [],
        pageSize: 25,
        renderItem: (p: PostObject | PostWithAttachment) => <Post { ...p } />
    }
};

export const photos: Page = {
    titleBar: {
        color: '#FCD872',
        image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhkMCCoRrTJDAAABB0lEQVQoz23OwSpEcRzF8c9cg5JRjO5NE2GjJHslJXkA8goWNhRLNoqysCDPYEV5AQs7HkCy0iws3JvFTCih/hbGdcucX/0Wv9+3c04paGnFmaZMJs33vdtSmLZmTY83s+7EYkm+lx0IVyELwlioB/8mDiEypYlEin0v9hT1HHnXRCzDhl4bhXcsizQLwLFXxwUgkUYahYhtFTtgyaO5X4dG7vCrLedqLkz+RSRSIy6tY9ehCANWpeW8w6gTVfPqrnOn7j+Hmn1VRE5N+GwBX7JyXrLUOvY6yh1K0p+SHSraqfwT0a0qagv0eIo8mJS5bAt0+ii7salm0YxxI4YNSQzq16fLgq9vEs5itEngYdUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDItMjVUMjA6MDg6NDItMDg6MDD8QgZXAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAyLTI1VDIwOjA4OjQyLTA4OjAwjR++6wAAAABJRU5ErkJggg==',
        title: 'Your Photos',
        subtitle: 'Photos you\'ve uploaded and shared'
    },
    data: {
        fetchRequests: [() => driveClient.getAlbumFiles()],
        pageSize: 10,
        renderItem: (a: AlbumIndexEntry) => <AlbumCover { ...a } />
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
        fetchRequests: [],
        pageSize: 25,
        renderItem: (c: CommentData) => <Comment { ...c } />
    }
};

export const messages: Page = {
    titleBar: {
        color: '#3578E5',
        image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjBQkTGS0pU+syAAAA7UlEQVQoz32RsUoDURBFDxJDLJNFK0VJk85OQbSxyhekSBHIFwTS+Q3+gX6DFkGbdFpmCzF2axNSiI2ikoAKwrHYfSto1jPFPN5cmHsZJKsDT02cOzfxxP3wn7aaA38zsBYEkfcuIjFKBUOLGAo2/Y/mEh0CEvOZvV84AqCDk1zdFhuO1dhNe6pO8CN3nSaq2LLshjNV3/FJ1Znrlm1ZyWQh9jOOVO25ZayObYjtfO2oxAW7wAo3VIFtbrljJzd+iWu+FoZ8cxWxWyjohlscLxh+2f851uGf8ZV7aZ4SAFMeOeeMiDrLPHDNNLj8BpDDbHwVTUxTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA1LTEwVDAyOjI1OjQ1LTA3OjAwLttmwQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNS0xMFQwMjoyNTo0NS0wNzowMF+G3n0AAAAASUVORK5CYII=',
        title: 'Your Messages',
        subtitle: 'Messages you\'ve exchanged'
    },
    data: {
        fetchRequests: [() => driveClient.getConversationFolders()],
        pageSize: 25,
        renderItem: (cf: ConversationFolder) => <ConversationTitle { ...cf } />
    }
};
