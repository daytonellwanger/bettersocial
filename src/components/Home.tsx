import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';

export default class Home extends React.Component {

    render() {
        return (
            <Container>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link to="/posts">Posts</Link>
                    <Link to="/photos">Photos and Videos</Link>
                    <Link to="/comments">Comments</Link>
                    <Link to="/messages">Messages</Link>
                </div>
            </Container>
        );
    }

}
