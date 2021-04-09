import React from 'react';
import { Container, Typography } from '@material-ui/core';
import Main from './Main';

interface S {
    error?: any;
}

export default class ErrorHandler extends React.Component<{}, S> {

    state: S = {};

    static getDerivedStateFromError(error: any) {
        error.stack = error.stack || (new Error()).stack;
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <Container>
                    <Typography variant="h4" color="secondary">{this.state.error.toString()}</Typography>
                    <Typography variant="caption" color="secondary">{this.state.error.stack}</Typography>
                </Container>
            );
        } else {
            return <Main />
        }
    }

}
