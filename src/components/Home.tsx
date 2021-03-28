import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import driveClient from '../DriveClient';
import { getTimeString } from '../util';
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
        <Container maxWidth="sm" style={{ marginBottom: '1em' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button color="secondary" component={Link} to={props.link}>{props.title}</Button>
                <IconButton onClick={props.onRefresh}>
                    <RefreshIcon color="secondary" />
                </IconButton>
            </div>
            {props.children}
        </Container>
    );
}

export default function Home() {

    const now = (new Date()).getTime();
    const [post, setPost] = useState<PostData>({ timestamp: now });
    const [photo, setPhoto] = useState<PhotoData>({ title: '', uri: undefined as any, creation_timestamp: now });
    const [comment, setComment] = useState<CommentData>({ title: '', timestamp: now });
    const [messages, setMessages] = useState<MessagePlus[]>([]);

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
            <Container style={{ paddingTop: '1em' }}>
                <Section title="Posts" link="/posts" onRefresh={() => getRandomPost()}>
                    <Post {...post} />
                </Section>
                <Section title="Photos and Videos" link="/photos" onRefresh={() => getRandomPhoto()}>
                    <GridList cellHeight={300} cols={1}>
                        <GridListTile>
                            {photo.uri ? <Image uri={photo.uri} link={true} /> : undefined}
                            <GridListTileBar
                                title={photo.description}
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
