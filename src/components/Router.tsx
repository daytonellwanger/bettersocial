import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import TopBar from './TopBar';
import Home from './Home';
import Posts from './Posts';

export default class Router extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div className="clearfix _ikh">
                    <div className="_4bl9">
                        <div className="_li">
                            <TopBar />
                            <div className="_3a_u">
                                <div className="_4t5n" role="main">
                                    <Route exact path="/" render={() => <Home />} />
                                    <Route exact path="/posts" render={() => <Posts />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

}
