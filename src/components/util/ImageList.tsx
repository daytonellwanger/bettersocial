import React from 'react';
import { GridList, GridListTile, Container, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import InfiniteScroller, { Fetch } from '../util/InfiniteScroller';

interface P {
    fetchRequests: Fetch[],
    renderItem: (item: any) => JSX.Element,
    renderTitle: () => JSX.Element
}

function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null)
        || 'xs';
}

function getColumns(width: Breakpoint) {
    switch (width) {
        case 'xs':
        case 'sm':
            return 1;
        case 'md':
            return 2;
        case 'lg':
        case 'xl':
            return 3;
        default:
            return 1;
    }
}

export default function ImageList(props: P) {

    const width = useWidth();
    const columns = getColumns(width);

    return (
        <div style={{ height: '100%', overflowY: 'scroll' }} id="imageListContainer">
            <Container>
                <InfiniteScroller
                    scrollableTarget="imageListContainer"
                    pageSize={30}
                    fetchRequests={props.fetchRequests}
                    renderItems={(items: any[]) => (
                        <div style={{ overflow: 'hidden' }}>
                            <GridList cellHeight={250} cols={columns}>
                                <GridListTile key="Subheader" cols={columns} style={{ height: 'auto' }}>
                                    {props.renderTitle()}
                                </GridListTile>
                                {items.map(item => props.renderItem(item))}
                            </GridList>
                        </div>
                    )} />
            </Container>
        </div>
    );
}
