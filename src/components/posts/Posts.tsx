import React from 'react';
import { decodeString, getTimeString } from '../../util';
import { ExternalContextAttachmentData, MediaAttachmentData, Post, PostData, PostWithAttachment } from '../../posts';
import driveClient from '../../DriveClient';
import Image from '../util/Image';
import './Posts.css';
import InfiniteScroller from '../util/InfiniteScroller'
import ContentContainer from '../ContentContainer';
import TitleBar from '../util/TitleBar';

export default class Posts extends React.Component {

    renderPostsTopBar() {
        return <TitleBar
                    color="#8C72CB"
                    image="iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEX///9MaXH///////////////////////////////////////+2I0voAAAAC3RSTlOAAHTdqgOD4wItpp12MDIAAABDSURBVAhbYxCEAgY4o8l6NxBs1mDQ3g0GmxisyxiAIH0zw25XkIqQ3Qy7oYBhN0RqNw4pLhDDGiglCTQRYSDcCgzbAVkOMGvtylXuAAAAAElFTkSuQmCC"
                    title="Your Posts" />;
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
                <div className="_3-94 _2lem">{getTimeString(post.timestamp)}</div>
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
                    <div>{decodeString(data.post)}</div>
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
                                            <Image uri={data.media.uri} link={true} />
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
        return (
            <InfiniteScroller
                getFetchRequests={async () => {
                    const posts = (await driveClient.getPosts())!;
                    return posts;
                }}
                fetchRequests={[]}
                pageSize={25}
                renderItem={(p: Post | PostWithAttachment) => this.renderPost(p)} />
        );
    }

    render() {
        return (
            <ContentContainer>
                {this.renderPostsTopBar()}
                {this.renderBody()}
            </ContentContainer>
        );
    }

}
