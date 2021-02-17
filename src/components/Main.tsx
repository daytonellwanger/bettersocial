import React from 'react';
import RingLoader from 'react-spinners/RingLoader';
import APIClient from '../APIClient';
import Router from './Router';
import SignIn from './SignIn';

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
            return (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8em' }}>
                    <RingLoader color="#7086ff" size={50} />
                </div>
            );
        } else {
            return this.state.isSignedIn
                ? <Router signOut={() => this.client.signOut()} />
                : <SignIn signIn={this.client.signIn} />;
        }
    }

}
