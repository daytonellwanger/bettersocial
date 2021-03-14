import React from 'react';
import CSS from 'csstype';
import JSZip from 'jszip';
import { uploadFiles } from '../upload';
import ProgressBar from './util/ProgressBar';

interface P {
    onUploadComplete: () => void;
}

interface S {
    uploading: boolean;
    progress: number;
    message: string;
    itemOverDropZone: boolean;
}

export default class Upload extends React.Component<P, S> {

    state: S = {
        uploading: false,
        progress: 0,
        message: '',
        itemOverDropZone: false
    };

    private inputRef: HTMLInputElement | null = null;

    render() {
        if (this.state.uploading) {
            return (
                <div style={progressContainerStyle}>
                    <ProgressBar progress={this.state.progress} message={this.state.message} />
                </div>
            )
        } else {
            return (
                <div style={{ padding: '10px' }}>
                    <p>Welcome to Social Freedom! To get started, upload your Facebook data file.</p>
                    <div style={uploadContainerStyle}>
                        <div style={this.state.itemOverDropZone ? activeDropZoneStyle : inactiveDropZoneStyle}
                            onDrop={(event) => this.handleDropFile(event)}
                            onDragOver={(event) => {
                                event.preventDefault();
                                this.setState({ ...this.state, itemOverDropZone: true })
                            }}
                            onDragLeave={(event) => {
                                event.preventDefault();
                                this.setState({ ...this.state, itemOverDropZone: false })
                            }}>
                            Drag and drop here
                        </div>
                        <p>or select with the file picker</p>
                        <form>
                            <input
                                type="file"
                                accept=".zip"
                                onChange={() => this.handleFileInput()}
                                ref={ref => this.inputRef = ref} />
                        </form>
                    </div>
                </div >
            );
        }
    }

    private async handleDropFile(event: React.DragEvent) {
        event.preventDefault();
        let file: File;
        if (event.dataTransfer.items) {
            if (event.dataTransfer.items.length > 1) {
                // complain
            }
            const item = event.dataTransfer.items[0];
            if (item.kind !== 'file') {
                // complain
            }
            file = item.getAsFile()!;
        } else {
            if (event.dataTransfer.files.length > 1) {
                // complain
            }
            file = event.dataTransfer.files[0];
        }
        if (!file) {
            // complain
        }
        await this.uploadFile(file);
    }

    private async handleFileInput() {
        const file = this.inputRef?.files?.item(0);
        if (!file) {
            // complain
            return;
        }
        await this.uploadFile(file);
    }

    private async uploadFile(file: File) {
        this.setState({ uploading: true, progress: 0, message: 'Unzipping' });
        const zip = await JSZip.loadAsync(file!);
        await uploadFiles(zip, (progress, message) => this.setState({ progress, message }));
        this.props.onUploadComplete();
    }

}

const progressContainerStyle: CSS.Properties = {
    width: '100%',
    height: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const uploadContainerStyle: CSS.Properties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const baseDropZoneStyle: CSS.Properties = {
    border: 'dotted',
    borderWidth: '1px',
    borderColor: '#aaaaaa',
    width: '100%',
    maxWidth: '500px',
    height: '20%',
    maxHeight: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const inactiveDropZoneStyle: CSS.Properties = {
    ...baseDropZoneStyle,
    backgroundColor: '#ddddea'
}

const activeDropZoneStyle: CSS.Properties = {
    ...baseDropZoneStyle,
    backgroundColor: '#4267b249'
}
