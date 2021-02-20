import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import driveClient from '../DriveClient';
import TopBar from './TopBar';
import Home from './Home';
import Posts from './posts/Posts';
import Photos from './photos/Photos';

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

}
