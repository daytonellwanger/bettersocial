import React from 'react';
import { Page as P } from './Pages';
import TitleBar from './util/TitleBar';
import InfiniteScroller from './util/InfiniteScroller';
import ContentContainer from './ContentContainer';

export default function Page(page: P) {
    return (
        <ContentContainer>
            <TitleBar {...page.titleBar} />
            <InfiniteScroller {...page.data} />
        </ContentContainer>
    );
}
