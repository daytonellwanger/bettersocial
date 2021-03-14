import React from 'react';
import { Photo as PhotoData } from '../../contracts/photos';
import { getTimeString } from '../../util';
import Image from '../util/Image';

export default function Photo(photo: PhotoData) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_3-96 _2let">
                <Image uri={photo.uri} link={true} />
                {
                    photo.description
                        ? <div className="_3-95">{photo.description}</div>
                        : undefined
                }
            </div>
            <div className="_3-94 _2lem">{getTimeString(photo.creation_timestamp)}</div>
        </div>
    );
}
