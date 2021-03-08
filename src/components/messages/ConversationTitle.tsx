import React from 'react';
import { Link } from 'react-router-dom';
import { ConversationFolder } from '../../messages';

interface P {
    conversationFolder: ConversationFolder;
}

export default class ConversationTitle extends React.Component<P> {

    render() {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                <div className="_2lek">
                    <Link to={{ pathname: '/conversation', state: { id: this.props.conversationFolder.id, name: this.props.conversationFolder.name } }}>{this.props.conversationFolder.name}</Link>
                </div>
            </div>
        );
    }

}
