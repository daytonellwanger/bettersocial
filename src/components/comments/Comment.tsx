import React from 'react';
import { Box, Card, Hidden, Typography } from '@material-ui/core';
import { Comment as CommentData } from '../../contracts/comments';
import { decodeString, getTimeString, getTimeStringFirstLine, getTimeStringSecondLine } from '../../util';

export default function Comment(comment: CommentData) {
    return (
        <Card elevation={3} style={{ padding: '1em', marginBottom: '1em' }}>
            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box style={{ flex: 2 }}>
                    <Typography style={{ paddingRight: '5em' }} variant="caption" color="textSecondary">{decodeString(comment.title)}</Typography>
                </Box>
                <Box style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Hidden smUp>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography variant="caption" color="textSecondary">{getTimeStringFirstLine(comment.timestamp)}</Typography>
                            <Typography variant="caption" color="textSecondary">{getTimeStringSecondLine(comment.timestamp)}</Typography>
                        </div>
                    </Hidden>
                    <Hidden xsDown>
                        <Typography variant="caption" color="textSecondary">{getTimeString(comment.timestamp)}</Typography>
                    </Hidden>
                </Box>
            </Box>
            {renderGroup(comment)}
            <Typography variant="body2" color="textPrimary">{decodeString(comment.data ? comment.data[0].comment.comment : '')}</Typography>
        </Card>
    );
}

function renderGroup(comment: CommentData) {
    if (comment.data && comment.data[0].comment.group) {
        return <Typography variant="caption" color="textSecondary">Group: {decodeString(comment.data[0].comment.group)}</Typography>;
    }
}
