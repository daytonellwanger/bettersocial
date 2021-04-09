import React from 'react';
import { Post as PostObject, PostWithAttachment } from '../contracts/posts';
import Post from './posts/Post';
import { Comment as CommentData } from '../contracts/comments';
import Comment from './comments/Comment';
import { P as InfiniteScrollerProps } from './util/InfiniteScroller';
import driveClient from '../DriveClient';

export interface Page {
    data: InfiniteScrollerProps;
}

export const posts: Page = {
    data: {
        fetchRequests: [() => driveClient.getPosts()],
        pageSize: 25,
        renderItem: (p: PostObject | PostWithAttachment) => (<div style={{ marginBottom: '1em' }}><Post { ...p } /></div>)
    }
};

export const comments: Page = {
    data: {
        fetchRequests: [() => driveClient.getComments()],
        pageSize: 25,
        renderItem: (c: CommentData) => <Comment { ...c } />
    }
};
