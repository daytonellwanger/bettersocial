import React from 'react';
import { Post as PostObject, PostWithAttachment } from '../../posts';
import driveClient from '../../DriveClient';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import Post from './Post';
import Page from '../Page';
import './Posts.css';

const titleBar: TitleBarProps = {
    color: '#8C72CB',
    image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC',
    title: 'Your Posts'
};

const data: InfiniteScrollerProps = {
    getFetchRequests: () => driveClient.getPosts(),
    fetchRequests: [],
    pageSize: 25,
    renderItem: (p: PostObject | PostWithAttachment) => <Post { ...p } />
};

export default class Posts extends React.Component {

    render() {
        return <Page titleBar={titleBar} infiniteScroller={data} />;
    }

}
