import React, { useEffect, useRef, useState } from 'react';
import { Card, Container, Typography, ListItem, useTheme, useMediaQuery, IconButton } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useAppInsightsContext, useTrackEvent, useTrackMetric } from '@microsoft/applicationinsights-react-js';
import { decodeString } from '../../util';
import driveClient from '../../DriveClient';
import { ConversationFolder } from '../../contracts/messages';
import Conversation from './Conversation';

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

function isFull(width: Breakpoint) {
    switch (width) {
        case 'xs':
        case 'sm':
            return false;
        case 'md':
        case 'lg':
        case 'xl':
        default:
            return true;
    }
}

export default function Messages() {

    const appInsights = useAppInsightsContext();
    const trackComponent = useTrackMetric(appInsights, 'Messages');
    trackComponent();
    const trackSelectConversation = useTrackEvent<any>(appInsights, 'SelectConversation', {});

    const [conversations, setConversations] = useState<ConversationFolder[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationFolder | undefined>();
    const [listOpen, setListOpen] = useState<boolean>(true);
    const conversationsRef = useRef(null);
    const width = useWidth();

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
            <ListItem button divider key={index} style={style} onClick={() => { trackSelectConversation({}); setSelectedConversation(conversation); setListOpen(false); }}>
                <Typography noWrap variant="button" color="secondary">{decodeString(conversation.name)}</Typography>
            </ListItem>
        );
    }

    function getFullContent() {
        return (
            <Container style={{ padding: '1.5em', height: '100%' }} maxWidth="lg">
                <Card elevation={3} style={{ height: '100%' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <AutoSizer>
                                {({ width, height }) => (
                                    <FixedSizeList width={width} height={height} itemSize={50} itemCount={conversations.length}>
                                        {renderConversationTitle}
                                    </FixedSizeList>
                                )}
                            </AutoSizer>
                        </div>
                        <div style={{ flex: 2, height: '100%', display: 'flex', flexDirection: 'column-reverse', overflowY: 'scroll' }} ref={conversationsRef}>
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

    function getSmallContent() {
        if (listOpen) {
            return (
                <Container style={{ padding: '.4em', height: '100%' }} maxWidth="lg">
                    <Card elevation={3} style={{ height: '100%' }}>
                        <AutoSizer>
                            {({ width, height }) => (
                                <FixedSizeList width={width} height={height} itemSize={50} itemCount={conversations.length}>
                                    {renderConversationTitle}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </Card>
                </Container>
            );
        } else {
            return (
                <Container style={{ padding: '.4em', flex: 1, display: 'flex', flexDirection: 'column' }} maxWidth="lg">
                    <Card elevation={3} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1em' }}>
                                <IconButton onClick={() => setListOpen(true)}>
                                    <ArrowBackIcon color="secondary" />
                                </IconButton>
                                <Typography noWrap variant="button" color="secondary">{decodeString(selectedConversation?.name || '')}</Typography>
                            </div>
                            <div style={{ flex: 1, flexBasis: 0, flexGrow: 1, display: 'flex', flexDirection: 'column-reverse', overflowY: 'scroll' }} id="convoScroller">
                                {
                                    selectedConversation
                                        ? <Conversation id={selectedConversation.id} name={selectedConversation.name} scrollableTarget="convoScroller" />
                                        : undefined
                                }
                            </div>
                        </div>
                    </Card>
                </Container>
            );
        }
    }

    return isFull(width) ? getFullContent() : getSmallContent();

}
