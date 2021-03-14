import React from 'react';
import { Message as MessageData } from '../../contracts/messages';
import { getConversationsRequests } from '../../DriveClient';
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
        return <Page titleBar={titleBar} data={data} />;
    }

}
