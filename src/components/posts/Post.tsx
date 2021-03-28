import React from 'react';
import { Card, Link, Typography } from '@material-ui/core';
import { decodeString, getTimeString } from '../../util';
import { ExternalContextAttachmentData, MediaAttachmentData, Post as PostObject, PostData, PostWithAttachment } from '../../contracts/posts';
import Image from '../util/Image';

export default function Post(post: PostObject | PostWithAttachment) {
    return (
        <Card elevation={3} style={{ padding: '1em' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ flex: 2 }}>
                    <Typography style={{ paddingRight: '5em' }} variant="caption" color="textSecondary">{decodeString(post.title || '')}</Typography>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="caption" color="textSecondary">{getTimeString(post.timestamp)}</Typography>
                </div>
            </div>
            {renderTags(post)}
            <div style={{ marginTop: '.5em' }}>
                {renderAttachments(post as PostWithAttachment)}
                {renderData(post)}
            </div>
        </Card>
    );
}

function renderData(post: PostObject) {
    if (post.data) {
        const postData = post.data.find(d => !!(d as PostData).post);
        if (postData) {
            return <Typography variant="body2" color="textPrimary">{decodeString(postData.post || '')}</Typography>;
        }
    }
    return undefined;
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
        return <Typography color="textSecondary" variant="caption">You tagged {decodeString(people)}</Typography>;
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
    return <Link color="secondary" variant="button" href={data.external_context.url}>{data.external_context.url}</Link>;
}

function renderMediaAttachmentData(data: MediaAttachmentData) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Image uri={data.media.uri} link={true} />
            <Typography color="textSecondary" variant="caption">{decodeString(data.media.description || '')}</Typography>
        </div>
    );
}
