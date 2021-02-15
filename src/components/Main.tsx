import React from 'react';
import APIClient from '../APIClient';
import Router from './Router';
import SignIn from './SignIn';

interface S {
    isReady: boolean;
}

export default class Main extends React.Component<{}, S> {

    private client = new APIClient(() => this.setState({ isReady: true }));

    state: S = {
        isReady: false
    };

    componentDidMount() {
        this.client.init();
    }

    render() {
        return this.state.isReady
            ? <Router />
            : <SignIn signIn={this.client.signIn} />;
    }

}
