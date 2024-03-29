import React from 'react';
import { Container, Link, Tooltip, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../AppInsights';

interface P {
    signIn: () => void;
}

class SignIn extends React.Component<P> {

    public render() {
        return (
            <Container style={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} maxWidth="md">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="h2">Welcome to Better Social</Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Button variant="contained" color="primary" onClick={this.props.signIn} style={{ marginTop: '1.5em', marginBottom: '1.5em', marginRight: '1em' }}>Sign In</Button>
                        <Button variant="contained" color="primary" onClick={() => window.open('/about', '_self')} style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>About</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Link href="/about#why-google" target="_blank" color="secondary" underline="always">Why Google sign in?</Link>
                        <Tooltip title="Google is a popular platform with free cloud storage that has a respectable privacy policy. Click the link to learn more.">
                            <InfoIcon color="secondary" fontSize="small" style={{ marginLeft: '.2em' }}/>
                        </Tooltip>
                    </div>
                </div>
            </Container>
        );
    }

}

export default withAITracking(reactPlugin, SignIn, 'SignIn');
