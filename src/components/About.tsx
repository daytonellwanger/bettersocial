import React from 'react';
import { Container, Typography } from '@material-ui/core';

export default class About extends React.Component {

    render() {
        return (
            <Container maxWidth="lg" style={{ padding: '2em' }}>
                <Typography variant="body1" color="secondary">Hello, world!</Typography>
            </Container>
        );
    }

}
