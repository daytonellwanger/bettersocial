import React from 'react';
import { MessagePlus } from '../../contracts/messages';
import { getConversationsRequests } from '../../DriveClient';
import Message from './Message';
import InfiniteScroller from '../util/InfiniteScroller';

interface P {
    id: string,
    name: string,
    scrollableTarget: React.ReactNode
}

export default function Conversation(props: P) {

    return (
        <InfiniteScroller id={props.id}
            inverse={true}
            pageSize={25}
            getFetchRequests={() => getConversationsRequests(props.id)}
            renderItem={(message: MessagePlus) => <Message key={message.timestamp_ms} { ...message } />}
            scrollableTarget={props.scrollableTarget} />
    );

}
