import React from 'react';
import { Page as P } from './Pages';
import TitleBar from './util/TitleBar';
import InfiniteScroller from './util/InfiniteScroller';

export default function Page(page: P) {
    return (
        <div className="_4t5n" role="main">
            <TitleBar {...page.titleBar} />
            <InfiniteScroller {...page.data} />
        </div>
    );
}
