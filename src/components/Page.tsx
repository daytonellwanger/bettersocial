import React from 'react';
import { Container } from '@material-ui/core';
import { Page as P } from './Pages';
import InfiniteScroller from './util/InfiniteScroller';

export default function Page(page: P) {
    return (
        <Container style={{ paddingTop: '1em' }} maxWidth="sm">
            <InfiniteScroller {...page.data} />
        </Container>
    );
}
