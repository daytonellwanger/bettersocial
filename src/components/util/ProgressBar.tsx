import React from 'react';
import CSS from 'csstype';

interface P {
    progress: number;
    message: string;
}

export default class ProgressBar extends React.Component<P> {

    render() {
        return (
            <div style={containerStyle}>
                <p>{this.props.message}</p>
                <div style={uploadContainerStyle}>
                    <div style={{ ...progressBarStyle, width: `${this.props.progress * 100}%` }}></div>
                </div>
            </div>
        );
    }

}

const containerStyle: CSS.Properties = {
    width: '100%',
    maxWidth: '500px',
    height: '100%',
};

const uploadContainerStyle: CSS.Properties = {
    width: '95%',
    height: '10px',
    border: 'solid',
    borderWidth: '1px',
    borderColor: '#aaaaaa'
};

const progressBarStyle: CSS.Properties = {
    height: '100%',
    backgroundColor: '#4267b2cc'
};
