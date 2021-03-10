import React from 'react';
import APIClient from '../APIClient';
import Router from './Router';
import SignIn from './SignIn';
import Loading from './util/Loading';

interface S {
    isSignedIn?: boolean;
}

export default class Main extends React.Component<{}, S> {

    private client = new APIClient((isSignedIn: boolean) => this.setState({ isSignedIn }));
    
    state: S = {};

    componentDidMount() {
        this.client.init();
    }

    render() {
        if (typeof this.state.isSignedIn === 'undefined') {
            return <Loading />;
        } else {
            return this.state.isSignedIn
                ? <Router signOut={() => this.client.signOut()} />
                : <SignIn signIn={this.client.signIn} />;
        }
    }

}
