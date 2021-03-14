import React from 'react';
import { Comment as CommentData } from '../../contracts/comments';
import { decodeString, getTimeString } from '../../util';

export default function Comment(comment: CommentData) {
    return (
        <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
            <div className="_3-96 _2pio _2lek _2lel">{comment.title}</div>
            <div className="_3-96 _2let">
                <div>
                    <div className="_2pin">
                        <div>
                            {renderGroup(comment)}
                            {decodeString(comment.data ? comment.data[0].comment.comment : '')}
                        </div>
                    </div>
                </div>
            </div>
            <div className="_3-94 _2lem">{getTimeString(comment.timestamp)}</div>
        </div>
    );
}

function renderGroup(comment: CommentData) {
    if (comment.data && comment.data[0].comment.group) {
        return <div className="_3-95"><span className="_4mp8">Group: </span>{comment.data[0].comment.group}</div>;
    }
}
