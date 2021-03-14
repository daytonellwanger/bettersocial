import React from 'react';
import { Message as MessageData } from '../../contracts/messages';
import { decodeString, getTimeString } from '../../util';
import Image from '../util/Image';
import File from '../util/File';

// TODO handle multiple files/photos
export default function Message(message: MessageData) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_3-96 _2pio _2lek _2lel">{message.sender_name}</div>
            <div className="_3-96 _2let">
                <div>
                    {message.content
                        ? <div>{decodeString(message.content || '')}</div>
                        : undefined}

                    {message.files
                        ? <File uri={message.files[0].uri} />
                        : undefined}

                    {message.photos
                        ? <Image uri={message.photos[0].uri} link={true} />
                        : undefined}
                </div>
            </div>
            <div className="_3-94 _2lem">{getTimeString(message.timestamp_ms / 1000)}</div>
        </div>
    );
}
