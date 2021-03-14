import React from 'react';
import TitleBar, { P as TitleBarProps } from './util/TitleBar';
import InfiniteScroller, { P as InfiniteScrollerProps } from './util/InfiniteScroller';
import ContentContainer from './ContentContainer';

interface P {
    titleBar: TitleBarProps;
    infiniteScroller: InfiniteScrollerProps;
}

export default class Page extends React.Component<P> {

    render() {
        return (
            <ContentContainer>
                <TitleBar { ...this.props.titleBar } />
                <InfiniteScroller { ...this.props.infiniteScroller } />
            </ContentContainer>
        );
    }

}
