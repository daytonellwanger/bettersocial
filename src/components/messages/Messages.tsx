import React, { useEffect, useRef, useState } from 'react';
import { Card, Container, Typography, ListItem } from '@material-ui/core';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { decodeString } from '../../util';
import driveClient from '../../DriveClient';
import { ConversationFolder } from '../../contracts/messages';
import Conversation from './Conversation';


export default function Messages() {

    const [conversations, setConversations] = useState<ConversationFolder[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationFolder | undefined>();
    const conversationsRef = useRef(null);

    async function getConversations() {
        const conversationFolders = (await driveClient.getConversationFolders()).filter(cf => !!cf.name);
        setConversations(conversationFolders);
        setSelectedConversation(conversationFolders[Math.floor((Math.random() * conversationFolders.length))]);
    }

    useEffect(() => {
        getConversations();
    }, []);

    function renderConversationTitle(props: ListChildComponentProps) {
        const { index, style } = props;
        const conversation = conversations[index];
        return (
            <ListItem button divider key={index} style={style} onClick={() => setSelectedConversation(conversation)}>
                <Typography noWrap variant="button" color="secondary">{decodeString(conversation.name)}</Typography>
            </ListItem>
        );
    }

    return (
        <Container style={{ paddingTop: '1em', height: '85%' }} maxWidth="lg">
            <Card elevation={3}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div style={{ flex: 1 }}>
                        <AutoSizer>
                            {({ width, height }) => (
                                <FixedSizeList width={width} height={height} itemSize={50} itemCount={conversations.length}>
                                    {renderConversationTitle}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </div>
                    <div style={{ flex: 2, overflowY: 'scroll', display: 'flex', flexDirection: 'column-reverse' }} ref={conversationsRef}>
                        {
                            selectedConversation
                                ? <Conversation id={selectedConversation.id} name={selectedConversation.name} scrollableTarget={conversationsRef.current} />
                                : undefined
                        }
                    </div>
                </div>
            </Card>
        </Container>
    );

}
