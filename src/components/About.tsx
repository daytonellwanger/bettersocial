import React from 'react';
import { Container, Typography } from '@material-ui/core';
import MainContainer from './MainContainer';

export default class About extends React.Component {

    render() {
        return (
            <MainContainer homeEnabled={true}>
                <Container maxWidth="lg" style={{ padding: '2em' }}>
                    <Typography variant="body1" color="secondary">Hello, world!</Typography>
                </Container>
            </MainContainer>
        );
    }

}
