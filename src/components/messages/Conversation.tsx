import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Conversation as ConversationData, Message as MessageData } from '../../messages';
import InfiniteScroller from '../util/InfiniteScroller';
import Message from './Message';

interface P {
    location: {
        state: {
            id: string,
            name: string
        }
    }
}

interface S {
    loading: boolean;
    conversation?: ConversationData;
    error?: string;
}

export default class Conversation extends React.Component<P, S> {

    state: S = {
        loading: true
    };

    async componentDidMount() {
        try {
            const conversation = await getConversation(this.props.location.state.id);
            this.setState({ loading: false, conversation });
        } catch (e) {
            this.setState({ loading: false, error: e });
        }
    }

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#3578E5' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjBQkTGS0pU+syAAAA7UlEQVQoz32RsUoDURBFDxJDLJNFK0VJk85OQbSxyhekSBHIFwTS+Q3+gX6DFkGbdFpmCzF2axNSiI2ikoAKwrHYfSto1jPFPN5cmHsZJKsDT02cOzfxxP3wn7aaA38zsBYEkfcuIjFKBUOLGAo2/Y/mEh0CEvOZvV84AqCDk1zdFhuO1dhNe6pO8CN3nSaq2LLshjNV3/FJ1Znrlm1ZyWQh9jOOVO25ZayObYjtfO2oxAW7wAo3VIFtbrljJzd+iWu+FoZ8cxWxWyjohlscLxh+2f851uGf8ZV7aZ4SAFMeOeeMiDrLPHDNNLj8BpDDbHwVTUxTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA1LTEwVDAyOjI1OjQ1LTA3OjAwLttmwQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNS0xMFQwMjoyNTo0NS0wNzowMF+G3n0AAAAASUVORK5CYII=" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">{this.props.location.state.name}</div>
                </div>
            </div>
        );
    }

    renderBody() {
        if (this.state.loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                    <PulseLoader color="#7086ff" size={10} />
                </div>
            );
        }
        if (this.state.error) {
            return <p>{this.state.error.toString()}</p>
        }
        return (
            <div className="_4t5n" role="main">
                <InfiniteScroller
                    allItems={this.state.conversation!.messages}
                    pageSize={25}
                    renderItem={(m: MessageData) => <Message message={m} />} />
            </div>
        );
    }

    render() {
        return (
            <div className="_3a_u">
                {this.renderTopBar()}
                {this.renderBody()}
            </div>
        );
    }

}

let getConversationQueue: Promise<ConversationData | undefined> = Promise.resolve(undefined);
async function getConversation(folderId: string): Promise<ConversationData | undefined> {
    getConversationQueue = getConversationQueue.then(async () => {
        // TODO limit to file type (i.e. exclude folders. Limit to JSON.
        const conversationFiles = (await gapi.client.drive.files.list({ q: `"${folderId}" in parents and name contains 'message_'` })).result.files!;
        if (!conversationFiles || conversationFiles.length === 0) {
            throw new Error('Could not find conversation file');
        }
        // TODO add support for multiple conversation files, as this happens
        // when chat history gets long
        const conversationFileId = conversationFiles[0].id!;
        if (!conversationFileId) {
            throw new Error('Conversation file has no ID');
        }

        const conversation = (await gapi.client.drive.files.get({ fileId: conversationFileId, alt: 'media' })).result as ConversationData;
        return conversation;
    });
    return getConversationQueue;
}
