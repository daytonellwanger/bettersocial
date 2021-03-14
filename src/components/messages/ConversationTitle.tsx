import React from 'react';
import { Link } from 'react-router-dom';
import { ConversationFolder } from '../../contracts/messages';

export default function ConversationTitle(conversationFolder: ConversationFolder) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_2lek">
                <Link to={{ pathname: '/conversation', state: { id: conversationFolder.id, name: conversationFolder.name } }}>{conversationFolder.name}</Link>
            </div>
        </div>
    );
}
