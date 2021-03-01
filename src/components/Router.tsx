import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import driveClient from '../DriveClient';
import TopBar from './TopBar';
import Home from './Home';
import Posts from './posts/Posts';
import Photos from './photos/Photos';
import Album from './photos/Album';
import Videos from './videos/Videos';
import CommentsComponent from './comments/Comments';
import Messages from './messages/Messages';
import Conversation from './messages/Conversation';

interface P {
    signOut: () => void;
}

export default class Router extends React.Component<P> {

    componentDidMount() {
        driveClient.init();
    }

    render() {
        return (
            <BrowserRouter>
                <div className="clearfix _ikh">
                    <div className="_4bl9">
                        <div className="_li">
                            <TopBar signOut={this.props.signOut} />
                            <div className="_3a_u">
                                <div className="_4t5n" role="main">
                                    <Route exact path="/" render={() => <Home />} />
                                    <Route exact path="/posts" render={() => <Posts />} />
                                    <Route exact path="/photos" render={() => <Photos />} />
                                    <Route exact path="/album" component={Album} />
                                    <Route exact path="/videos" render={() => <Videos />} />
                                    <Route exact path="/comments" render={() => <CommentsComponent />} />
                                    <Route exact path="/messages" render={() => <Messages /> } />
                                    <Route exact path="/conversation" component={Conversation} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

}
