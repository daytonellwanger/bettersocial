import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import APIClient from '../APIClient';
import SignIn from './SignIn';
import TopBar from './TopBar';
import Home from './Home';
import Posts from './Posts';

interface S {
    isReady: boolean;
}

export default class Router extends React.Component<{}, S> {

    private client = new APIClient(() => this.setState({ isReady: true }));

    state: S = {
        isReady: false
    };

    componentDidMount() {
        this.client.init();
    }

    render() {
        return this.state.isReady
            ? (
                <div className="clearfix _ikh">
                    <div className="_4bl9">
                        <div className="_li">
                            <TopBar />
                            <div className="_3a_u">
                                <div className="_4t5n" role="main">
                                    <BrowserRouter>
                                        <Route exact path="/" component={Home} />
                                        <Route exact path="/posts" component={Posts} />
                                    </BrowserRouter>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            : <SignIn signIn={this.client.signIn} />;
    }

}
