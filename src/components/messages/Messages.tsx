import React from 'react';
import driveClient from '../../DriveClient';
import { ConversationFolder } from '../../messages';
import ContentContainer from '../ContentContainer';
import InfiniteScroller from '../util/InfiniteScroller';
import ConversationTitle from './ConversationTitle';

export default class Messages extends React.Component {

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#3578E5' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjBQkTGS0pU+syAAAA7UlEQVQoz32RsUoDURBFDxJDLJNFK0VJk85OQbSxyhekSBHIFwTS+Q3+gX6DFkGbdFpmCzF2axNSiI2ikoAKwrHYfSto1jPFPN5cmHsZJKsDT02cOzfxxP3wn7aaA38zsBYEkfcuIjFKBUOLGAo2/Y/mEh0CEvOZvV84AqCDk1zdFhuO1dhNe6pO8CN3nSaq2LLshjNV3/FJ1Znrlm1ZyWQh9jOOVO25ZayObYjtfO2oxAW7wAo3VIFtbrljJzd+iWu+FoZ8cxWxWyjohlscLxh+2f851uGf8ZV7aZ4SAFMeOeeMiDrLPHDNNLj8BpDDbHwVTUxTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA1LTEwVDAyOjI1OjQ1LTA3OjAwLttmwQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wNS0xMFQwMjoyNTo0NS0wNzowMF+G3n0AAAAASUVORK5CYII=" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">Your Messages</div>
                    <div className="_3b0e">Messages you've exchanged</div>
                </div>
            </div>
        );
    }

    renderBody() {
        return (
            <InfiniteScroller
                fetchRequests={[async () => {
                    const conversations = await driveClient.getConversationFolders();
                    return conversations;
                }]}
                pageSize={25}
                renderItem={(cf: ConversationFolder) => <ConversationTitle conversationFolder={cf} />} />
        );
    }

    render() {
        return (
            <ContentContainer>
                {this.renderTopBar()}
                {this.renderBody()}
            </ContentContainer>
        );
    }

}
