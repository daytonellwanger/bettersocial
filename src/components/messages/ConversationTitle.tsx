import React from 'react';
import { Link } from 'react-router-dom';
import { decodeString } from '../../util';
import { ConversationFolder } from '../../contracts/messages';

export default function ConversationTitle(conversationFolder: ConversationFolder) {
    return <Link to={{ pathname: '/conversation', state: { id: conversationFolder.id, name: conversationFolder.name } }}>{decodeString(conversationFolder.name)}</Link>;
}
