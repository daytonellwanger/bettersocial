import React from 'react';
import { Container, Typography } from '@material-ui/core';
import MainContainer from './MainContainer';

export default class Contact extends React.Component {

    render() {
        return (
            <MainContainer homeEnabled={true} betterSocialLink="/" openBetterSocialLinkInNewTab={false}>
                <div style={{ height: '100%', overflowY: 'scroll' }}>
                    <Container maxWidth="lg" style={{ padding: '2em' }}>
                        <Typography variant="body1" color="secondary">For all matters, contact Dayton Ellwanger at daytonellwanger@gmail.com.</Typography>
                    </Container>
                </div>
            </MainContainer>
        );
    }

}
