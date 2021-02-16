import React from 'react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ExternalContextAttachmentData, MediaAttachmentData, Post, PostData, PostWithAttachment } from '../Posts';
import driveClient from '../DriveClient';
import Image from './Image';
import './Posts.css';

const pageSize = 25;

interface S {
    loading: boolean,
    posts: (Post | PostWithAttachment)[],
    loadedPosts: (Post | PostWithAttachment)[],
    error?: string
}

export default class Posts extends React.Component<{}, S> {

    state: S = {
        loading: true,
        posts: [],
        loadedPosts: []
    };

    async componentDidMount() {
        try {
            const posts = (await driveClient.getPosts())!;
            const loadedPosts = posts.slice(0, Math.min(pageSize, posts.length));
            this.setState({ loading: false, posts, loadedPosts });
        } catch (e) {
            this.setState({ loading: false, error: JSON.stringify(e, null, 2) });
        }
    }

    renderPostsTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#8C72CB' }} className="_3z-t"><img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">Your Posts</div>
                </div>
            </div>
        );
    }

    renderPost(post: Post | PostWithAttachment) {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                {
                    post.title
                        ? <div className="_3-96 _2pio _2lek _2lel">{post.title}</div>
                        : undefined
                }
                {this.renderTags(post)}
                <div className="_3-96 _2let">
                    {this.renderAttachments(post as PostWithAttachment)}
                    {this.renderData(post)}
                </div>
                <div className="_3-94 _2lem">{moment(post.timestamp*1000).format('MMM Do, YYYY, h:mm A')}</div>
            </div>
        );
    }

    renderData(post: Post) {
        if (post.data) {
            const postData = post.data.find(d => !!(d as PostData).post);
            if (postData) {
                return this.renderPostData(postData);
            } 
        }
        return undefined;
    }

    renderPostData(data: PostData) {
        return (
            <div>
                <div className="_2pin">
                    <div>{data.post}</div>
                </div>
            </div>
        );
    }

    renderTags(post: Post) {
        if (post.tags && post.tags.length > 0) {
            let people = '';
            if (post.tags.length === 1) {
                people = post.tags[0];
            } else {
                people = post.tags.slice(0, post.tags.length - 1).join(', ');
                people = `${people} and ${post.tags[post.tags.length - 1]}`;
            }
            return (
                <div>
                    <div className="_u14">You tagged {people}</div>
                </div>
            );
        }
        return undefined;
    }

    renderAttachments(post: PostWithAttachment) {
        if (post.attachments && post.attachments.length > 0) {
            const attachment = post.attachments[0];
            const attachmentData = attachment.data[0];
            if ((attachmentData as ExternalContextAttachmentData).external_context) {
                return this.renderExternalContextAttachmentData(attachmentData as ExternalContextAttachmentData);
            } else if ((attachmentData as MediaAttachmentData).media) {
                return this.renderMediaAttachmentData(attachmentData as MediaAttachmentData);
            }
        }
        return undefined;
    }

    renderExternalContextAttachmentData(data: ExternalContextAttachmentData) {
        return (
            <div className="_2pin">
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <a href={data.external_context.url}>{data.external_context.url}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderMediaAttachmentData(data: MediaAttachmentData) {
        return (
            <div className="_2pin">
                <div>
                    <div>
                        <table className="uiGrid _51mz" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr className="_51mx">
                                    <td className="_51m- pas">
                                        <div>
                                            <Image data={data} />
                                            <div className="_3-95">{data.media.description}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    renderBody() {
        if (this.state.loading) {
            return <p>Loading...</p>
        }
        if (this.state.error) {
            return <p>{this.state.error}</p>
        }
        return (
            <InfiniteScroll
                dataLength={this.state.loadedPosts.length}
                next={() => {
                    const loadedPosts = this.state.loadedPosts.concat(
                        this.state.posts.slice(
                            this.state.loadedPosts.length,
                            Math.min(this.state.loadedPosts.length + pageSize, this.state.posts.length)
                        )
                    );
                    this.setState({ ...this.state, loadedPosts });
                }}
                hasMore={this.state.posts.length > this.state.loadedPosts.length}
                loader={<p>Loading...</p>}
            >
                {this.state.loadedPosts.map((p, idx) => (
                    <div key={idx}>
                        {this.renderPost(p)}
                    </div>
                ))}
            </InfiniteScroll>
        );
    }

    render() {
        return (
            <div>
                {this.renderPostsTopBar()}
                {this.renderBody()}
            </div>
        );
    }

}
