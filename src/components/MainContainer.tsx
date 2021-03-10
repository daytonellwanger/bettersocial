import React from 'react';
import TopBar from './TopBar';

interface P {
    homeEnabled: boolean;
    signOut: () => void;
}

export default class MainContainer extends React.Component<P> {

    render() {
        return (
            <div className="clearfix _ikh">
                <div className="_4bl9">
                    <div className="_li">
                        <TopBar signOut={this.props.signOut} homeEnabled={this.props.homeEnabled} />
                        <div className="_3a_u">
                            <div className="_4t5n" role="main">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
