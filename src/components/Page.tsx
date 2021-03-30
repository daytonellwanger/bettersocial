import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Page as P } from './Pages';
import InfiniteScroller from './util/InfiniteScroller';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            paddingTop: '1em',
            paddingRight: '.4em',
            paddingLeft: '.4em'
        }
    })
);

export default function Page(page: P) {
    const classes = useStyles();
    return (
        <div style={{ height: '100%', overflowY: 'scroll' }} id="pageContainer">
            <Container className={classes.container} maxWidth="sm">
                <InfiniteScroller {...page.data} scrollableTarget="pageContainer" />
            </Container>
        </div>
    );
}
