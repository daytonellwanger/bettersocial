import React from 'react';
import { Link } from 'react-router-dom';
import { AlbumIndexEntry } from '../../photos';
import { getTimeString } from '../../util';
import Image from '../util/Image';

export default function AlbumCover(album: AlbumIndexEntry) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_3-96 _2pio _2lek _2lel">{album.name} - {album.numPhotos} photo{album.numPhotos === 1 ? '' : 's'}</div>
            <div className="_3-96 _2let">
                <Link to={{ pathname: '/album', state: { id: album.id, name: album.name } }}>
                    <Image uri={album.photo} />
                </Link>
            </div>
            <div className="_3-94 _2lem">{getTimeString(album.timestamp)}</div>
        </div>
    );
}
