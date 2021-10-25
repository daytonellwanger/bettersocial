import React from 'react';
import { Container, Link, Typography } from '@material-ui/core';
import { appInsights } from '../AppInsights';
import MainRouter from './MainRouter';

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
            appInsights.trackException({ exception: this.state.error });
            return (
                <Container style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h4" color="secondary" style={{ marginBottom: '1em' }}>Whoops! Something went wrong. <Link href="https://bettersocial.life/feedback" target="_blank" underline="always">Report an issue</Link>.</Typography>
                        <Typography variant="caption" color="secondary" style={{ marginBottom: '.5em' }}>Details:</Typography>
                        <Typography variant="h4" color="secondary">{this.state.error.toString()}</Typography>
                        <Typography variant="caption" color="secondary">{this.state.error.stack}</Typography>
                    </div>
                </Container>
            );
        } else {
            return <MainRouter />
        }
    }

}
