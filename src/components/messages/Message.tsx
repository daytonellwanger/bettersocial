import React from 'react';
import { Card, Hidden, Typography } from '@material-ui/core';
import { MessagePlus } from '../../contracts/messages';
import { decodeString, getTimeString, getTimeStringFirstLine, getTimeStringSecondLine } from '../../util';
import Image from '../util/Image';
import File from '../util/File';

// TODO handle multiple files/photos
export default function Message(message: MessagePlus) {

    return (
        <Card square elevation={1} style={{ padding: '1em', marginBottom: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ flex: 2, paddingRight: '3em' }}>
                    <Typography variant="caption" color="textSecondary">{decodeString(message.sender_name)}</Typography>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Hidden smUp>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography variant="caption" color="textSecondary">{getTimeStringFirstLine(message.timestamp_ms / 1000)}</Typography>
                            <Typography variant="caption" color="textSecondary">{getTimeStringSecondLine(message.timestamp_ms / 1000)}</Typography>
                        </div>
                    </Hidden>
                    <Hidden xsDown>
                        <Typography variant="caption" color="textSecondary">{getTimeString(message.timestamp_ms / 1000)}</Typography>
                    </Hidden>
                </div>
            </div>
            <div>
                <div style={message.fromSelf ? { display: 'flex', justifyContent: 'flex-end' } : { display: 'flex', justifyContent: 'flex-start' }}>
                    {message.content
                        ? <Typography variant="body2" color="textPrimary" align={message.fromSelf ? 'right' : 'left'}>{decodeString(message.content || '')}</Typography>
                        : undefined}

                    {message.files
                        ? <File uri={message.files[0].uri} />
                        : undefined}
                </div>
                {message.photos
                    ? <Image uri={message.photos[0].uri} link={true} />
                    : undefined}
            </div>
        </Card>
    );
}
