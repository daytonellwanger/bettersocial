import React from 'react';
import RingLoader from 'react-spinners/RingLoader';

export default class Loading extends React.Component {

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8em' }}>
                <RingLoader color="#7086ff" size={50} />
            </div>
        );
    }

}
