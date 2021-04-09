import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, GridList, GridListTile, GridListTileBar, IconButton, useMediaQuery, useTheme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RefreshIcon from '@material-ui/icons/Refresh';
import driveClient from '../DriveClient';
import { decodeString, getTimeString } from '../util';
import { Post as PostData } from '../contracts/posts';
import { Comment as CommentData } from '../contracts/comments';
import { Photo as PhotoData } from '../contracts/photos';
import { MessagePlus } from '../contracts/messages';
import Post from './posts/Post';
import Image from './util/Image';
import Comment from './comments/Comment';
import Message from './messages/Message';

function Section(props: React.PropsWithChildren<{ title: string, link: string, onRefresh: () => void }>) {
    return (
        <Container maxWidth="sm" style={{ marginBottom: '1em', paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button color="secondary" component={Link} to={props.link} endIcon={<ChevronRightIcon />}>{props.title}</Button>
                <IconButton onClick={props.onRefresh}>
                    <RefreshIcon color="secondary" />
                </IconButton>
            </div>
            {props.children}
        </Container>
    );
}

function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null)
        || 'xs';
}

function getCellHeight(width: Breakpoint) {
    switch (width) {
        case 'xs':
        case 'sm':
            return 180;
        case 'md':
        case 'lg':
        case 'xl':
        default:
            return 300;
    }
}

export default function Home() {

    const now = (new Date()).getTime();
    const [post, setPost] = useState<PostData>({ timestamp: now });
    const [photo, setPhoto] = useState<PhotoData>({ title: '', uri: undefined as any, creation_timestamp: now });
    const [comment, setComment] = useState<CommentData>({ title: '', timestamp: now });
    const [messages, setMessages] = useState<MessagePlus[]>([]);
    const width = useWidth();

    async function getRandomPost() {
        const post = await driveClient.getRandomPost();
        setPost(post);
    }

    async function getRandomPhoto() {
        const photo = await driveClient.getRandomPhoto();
        setPhoto(photo);
    }

    async function getRandomComment() {
        const comment = await driveClient.getRandomComment();
        setComment(comment);
    }

    async function getRandomMessages() {
        const messages = await driveClient.getRandomMessages();
        setMessages(messages.reverse());
    }

    useEffect(() => {
        getRandomPost();
        getRandomPhoto();
        getRandomComment();
        getRandomMessages();
    }, []);

    return (
        <div style={{ height: '100%', overflowY: 'scroll' }}>
            <Container style={{ paddingTop: '1em', paddingLeft: '.4em', paddingRight: '.4em' }}>
                <Section title="Posts" link="/posts" onRefresh={() => getRandomPost()}>
                    <Post {...post} />
                </Section>
                <Section title="Photos and Videos" link="/photos" onRefresh={() => getRandomPhoto()}>
                    <GridList cellHeight={getCellHeight(width)} cols={1}>
                        <GridListTile>
                            {photo.uri ? <Image uri={photo.uri} link={true} /> : undefined}
                            <GridListTileBar
                                title={decodeString(photo.description || '')}
                                subtitle={getTimeString(photo.creation_timestamp)} />
                        </GridListTile>
                    </GridList>
                </Section>
                <Section title="Comments" link="/comments" onRefresh={() => getRandomComment()}>
                    <Comment {...comment} />
                </Section>
                <Section title="Messages" link="/messages" onRefresh={() => getRandomMessages()}>
                    {messages.map(m => <Message {...m} />)}
                </Section>
            </Container>
        </div>
    );
}
