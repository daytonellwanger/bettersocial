import React from 'react';
import { Message as MessageData } from '../../messages';
import { decodeString, getTimeString } from '../../util';
import Image from '../util/Image';
import File from '../util/File';

interface P {
    message: MessageData;
}

export default class Message extends React.Component<P> {

    // TODO handle multiple files/photos
    render() {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                <div className="_3-96 _2pio _2lek _2lel">{this.props.message.sender_name}</div>
                <div className="_3-96 _2let">
                    <div>
                        {this.props.message.content
                            ? <div>{decodeString(this.props.message.content || '')}</div>
                            : undefined}
                        
                        {this.props.message.files
                            ? <File uri={this.props.message.files[0].uri} />
                            : undefined}

                        {this.props.message.photos
                            ? <Image uri={this.props.message.photos[0].uri} link={true} />
                            : undefined}
                    </div>
                </div>
                <div className="_3-94 _2lem">{getTimeString(this.props.message.timestamp_ms / 1000)}</div>
            </div>
        );
    }

}
