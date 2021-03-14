import React from 'react';
import { ExternalContextAttachmentData, MediaAttachmentData, Post as PostObject, PostData, PostWithAttachment } from '../../contracts/posts';
import { decodeString, getTimeString } from '../../util';
import Image from '../util/Image';

export default function Post(post: PostObject | PostWithAttachment) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            {
                post.title
                    ? <div className="_3-96 _2pio _2lek _2lel">{post.title}</div>
                    : undefined
            }
            {renderTags(post)}
            <div className="_3-96 _2let">
                {renderAttachments(post as PostWithAttachment)}
                {renderData(post)}
            </div>
            <div className="_3-94 _2lem">{getTimeString(post.timestamp)}</div>
        </div>
    );
}

function renderData(post: PostObject) {
    if (post.data) {
        const postData = post.data.find(d => !!(d as PostData).post);
        if (postData) {
            return renderPostData(postData);
        }
    }
    return undefined;
}

function renderPostData(data: PostData) {
    return (
        <div>
            <div className="_2pin">
                <div>{decodeString(data.post)}</div>
            </div>
        </div>
    );
}

function renderTags(post: PostObject) {
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

function renderAttachments(post: PostWithAttachment) {
    if (post.attachments && post.attachments.length > 0) {
        const attachment = post.attachments[0];
        const attachmentData = attachment.data[0];
        if ((attachmentData as ExternalContextAttachmentData).external_context) {
            return renderExternalContextAttachmentData(attachmentData as ExternalContextAttachmentData);
        } else if ((attachmentData as MediaAttachmentData).media) {
            return renderMediaAttachmentData(attachmentData as MediaAttachmentData);
        }
    }
    return undefined;
}

function renderExternalContextAttachmentData(data: ExternalContextAttachmentData) {
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

function renderMediaAttachmentData(data: MediaAttachmentData) {
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
