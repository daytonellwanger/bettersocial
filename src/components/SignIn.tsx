import React from 'react';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

interface P {
    signIn: () => void;
}

export default class SignIn extends React.Component<P> {

    public render() {
        return (
            <Container style={{ paddingTop: '1em' }}>
                <Button variant="contained" color="primary" onClick={this.props.signIn}>Sign In</Button>
            </Container>
        );
    }

}
