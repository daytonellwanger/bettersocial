import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import driveClient from '../DriveClient';
import MainContainer from './MainContainer';
import Home from './Home';
import Album from './photos/Album';
import Videos from './videos/Videos';
import Conversation from './messages/Conversation';
import Upload from './Upload';
import Loading from './util/Loading';
import Page from './Page';
import { posts, photos, comments, messages } from './Pages';

interface P {
    signOut: () => void;
}

interface S {
    loading: boolean;
    hasData: boolean;
}

export default class Router extends React.Component<P, S> {

    state: S = {
        loading: true,
        hasData: false
    };

    async initDriveClient() {
        try {
            this.setState({ loading: true, hasData: false });
            await driveClient.init(true);
            this.setState({ loading: false, hasData: true });
        } catch {
            this.setState({ loading: false, hasData: false });
        }
    }

    async componentDidMount() {
        await this.initDriveClient();
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        } else {
            if (this.state.hasData) {
                return (
                    <BrowserRouter>
                        <MainContainer homeEnabled={true} signOut={this.props.signOut}>
                            <Route exact path="/" render={() => <Home />} />
                            <Route exact path="/posts" render={() => <Page { ...posts } />} />
                            <Route exact path="/photos" render={() => <Page { ...photos } />} />
                            <Route exact path="/album" component={Album} />
                            <Route exact path="/videos" render={() => <Videos />} />
                            <Route exact path="/comments" render={() => <Page { ...comments } />} />
                            <Route exact path="/messages" render={() => <Page { ...messages } />} />
                            <Route exact path="/conversation" component={Conversation} />
                        </MainContainer>
                    </BrowserRouter>
                );
            } else {
                return (
                    <MainContainer homeEnabled={false} signOut={this.props.signOut}>
                        <Upload onUploadComplete={() => this.initDriveClient()} />
                    </MainContainer>
                );
            }
        }
    }

}
