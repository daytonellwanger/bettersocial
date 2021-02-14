import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import APIClient from '../APIClient';
import SignIn from './SignIn';
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
                <BrowserRouter>
                    <Route exact path="/" component={Posts} />
                </BrowserRouter>
            )
            : <SignIn signIn={this.client.signIn} />;
    }
    
}
