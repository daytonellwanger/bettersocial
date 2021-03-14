import React from 'react';
import { Conversation as ConversationData, Message as MessageData } from '../../messages';
import { P as InfiniteScrollerProps } from '../util/InfiniteScroller';
import { P as TitleBarProps } from '../util/TitleBar';
import Message from './Message';
import Page from '../Page';

interface P {
    location: {
        state: {
            id: string,
            name: string
        }
    }
}

export default class Conversation extends React.Component<P> {

    render() {
        const titleBar: TitleBarProps = {
            color: '#3578E5',
            image: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjBQkTGS0pU+syAAAA7UlEQVQoz32RsUoDURBFDxJDLJNFK0VJk85OQbSxyhekSBHIFwTS+Q3+gX6DFkGbdFpmCzF2axNSiI2ikoAKwrHYfSto1jPFPN5cmHsZJKsDT02cOzfxxP3wn7aaA38zsBYEkfcuIjFKBUOLGAo2/Y/mEh0CEvOZvV84AqCDk1zdFhuO1dhNe6pO8CN3nSaq2LLshjNV3/FJ1Znrlm1ZyWQh9jOOVO25ZayObYjtfO2oxAW7wAo3VIFtbrljJzd+iWu+FoZ8cxWxWyjohlscLxh+2f851uGf8ZV7aZ4SAFMeOeeMiDrLPHDNNLj8BpDDbHwVTUxTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA1LTEwVDAyOjI1OjQ1LTA3OjAwLttmwQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNS0xMFQwMjoyNTo0NS0wNzowMF+G3n0AAAAASUVORK5CYII=',
            title: this.props.location.state.name
        };
        const data: InfiniteScrollerProps = {
            getFetchRequests: () => getConversationsRequests(this.props.location.state.id),
            fetchRequests: [],
            pageSize: 25,
            renderItem: (m: MessageData) => <Message { ...m } />
        };
        return <Page titleBar={titleBar} infiniteScroller={data} />;
    }

}

async function getConversationsRequests(folderId: string): Promise<(() => Promise<MessageData[]>)[]> {
    const conversationPages = (await gapi.client.drive.files.list({ q: `"${folderId}" in parents and name contains 'message_'` })).result.files!;
    if (!conversationPages || conversationPages.length === 0) {
        throw new Error('Could not find conversation file');
    }

    const conversationsRequests = conversationPages.filter(f => !!f.id).sort((a, b) => a.name!.localeCompare(b.name!)).map(f => {
        return async () => {
            const conversation = (await gapi.client.drive.files.get({ fileId: f.id!, alt: 'media' })).result as ConversationData;
            return conversation.messages;
        }
    });

    return conversationsRequests;
}
