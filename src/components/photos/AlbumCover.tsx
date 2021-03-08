import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeString } from '../../util';
import Image from '../util/Image';
import { AlbumIndexEntry } from '../../photos';

interface P {
    album: AlbumIndexEntry;
}

export default class AlbumCover extends React.Component<P> {

    renderBody() {
        return (
            <div>
                <div className="_3-96 _2pio _2lek _2lel">{this.props.album.name} - {this.props.album.numPhotos} photo{this.props.album.numPhotos === 1 ? '' : 's'}</div>
                <div className="_3-96 _2let">
                    <Link to={{ pathname: '/album', state: { id: this.props.album.id, name: this.props.album.name } }}>
                        <Image uri={this.props.album.photo} />
                    </Link>
                </div>
                <div className="_3-94 _2lem">{getTimeString(this.props.album.timestamp)}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                {this.renderBody()}
            </div>
        );
    }

}
