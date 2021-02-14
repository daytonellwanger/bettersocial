import React from 'react';
import CSS from 'csstype';

interface P {
    signIn: () => void;
}

export default class SignIn extends React.Component<P> {

    public render() {
        return (
            <div style={container}>
                <button onClick={this.props.signIn}>Sign In</button>
            </div>
        );
    }

}

const container: CSS.Properties = {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
}
