import React from 'react';
import { FileData, getFileData } from '../../DriveClient';

interface P {
    uri: string;
}

export default class File extends React.Component<P, FileData> {

    state: FileData = {
        name: '',
        webViewLink: '',
        iconLink: ''
    };

    async componentDidMount() {
        const fileData = await getFileData(this.props.uri);
        if (fileData) {
            this.setState({ ...fileData });
        }
    }

    render() {
        return (
            <a href={this.state.webViewLink} target="_blank" rel="noopener noreferrer">
                <img referrerPolicy="no-referrer" src={this.state.iconLink} />
                {this.state.name}
            </a>
        );
    }

}
