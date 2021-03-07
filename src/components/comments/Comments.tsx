import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import driveClient from '../../DriveClient';
import { Comment } from '../../comments';
import { decodeString, getTimeString } from '../../util';

interface S {
    loading: boolean;
    comments: Comment[];
    error?: string;
}

export default class CommentsComponent extends React.Component<{}, S> {

    state: S = {
        loading: true,
        comments: []
    }

    async componentDidMount() {
        try {
            const comments = (await driveClient.getComments())!;
            this.setState({ loading: false, comments });
        } catch (e) {
            this.setState({ loading: false, error: JSON.stringify(e, null, 2) });
        }
    }

    renderTopBar() {
        return (
            <div className="_3-8y _3-95 _3b0b">
                <div style={{ backgroundColor: '#F7923B' }} className="_3z-t">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfjAhsBIAbc+avSAAAAjUlEQVQoz62ROw7CMBBEnxPCERDHCb3Pyl04QVJQBgkJUSBsHoUV8ZEcGnaaleYVs7NBlqcBYMeJhG9KjEQAxGhtekEcqsAkQUi0lQCZVRCWcobmxxH8B8hVNxfgXAWOpai+2kMsRWF0MKv68K5qcrKXGcBO1ZuTWxFbu+K8/qNXD27kU/PSenHv+tuWJ8EkvUiVqwYRAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTI3VDA5OjMyOjA2LTA4OjAw49wxUAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yN1QwOTozMjowNi0wODowMJKBiewAAAAASUVORK5CYII=" />
                </div>
                <div className="_3b0c">
                    <div className="_3b0d">Comments</div>
                    <div className="_3b0e">Comments you've posted</div>
                </div>
            </div>
        );
    }

    renderGroup(comment: Comment) {
        if (comment.data && comment.data[0].comment.group) {
            return <div className="_3-95"><span className="_4mp8">Group: </span>{comment.data[0].comment.group}</div>;
        }
        return undefined;
    }

    renderComment(comment: Comment) {
        return (
            <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
                <div className="_3-96 _2pio _2lek _2lel">{comment.title}</div>
                <div className="_3-96 _2let">
                    <div>
                        <div className="_2pin">
                            <div>
                                {this.renderGroup(comment)}
                                {decodeString(comment.data ? comment.data[0].comment.comment : '')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="_3-94 _2lem">{getTimeString(comment.timestamp)}</div>
            </div>
        );
    }

    renderBody() {
        if (this.state.loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
                    <PulseLoader color="#7086ff" size={10} />
                </div>
            );
        }
        if (this.state.error) {
            return <p>{this.state.error}</p>
        }
        return (
            <div className="_4t5n" role="main">
                {this.state.comments.map((comment, idx) => (
                    <div key={idx}>
                        {this.renderComment(comment)}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="_3a_u">
                {this.renderTopBar()}
                {this.renderBody()}
            </div>
        );
    }

}