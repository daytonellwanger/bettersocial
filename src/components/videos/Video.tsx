import React from 'react';
import { Video as VideoData } from '../../photos';
import { decodeString, getTimeString } from '../../util';
import Image from '../util/Image';

export default function Video(video: VideoData) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_3-96 _2let">
                <Image uri={video.uri} link={true} />
                <div className="_3-95">{decodeString(video.description)}</div>
            </div>
            <div className="_3-94 _2lem">{getTimeString(video.creation_timestamp)}</div>
        </div>
    );
}