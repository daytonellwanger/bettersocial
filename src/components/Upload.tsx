import React from 'react';
import { Button, Container, Typography } from '@material-ui/core';
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
                <Container style={{ padding: '2em' }} maxWidth="sm">
                    <Typography color="secondary" variant="h5">Welcome to Social Freedom! To get started, upload your Facebook data file.</Typography>
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
                        <Typography color="textSecondary" variant="caption">Drag and drop here</Typography>
                    </div>
                    <Typography color="secondary" variant="caption">or select with the file picker</Typography>
                    <div style={{ height: '.5em' }} />
                    <Button
                        variant="contained"
                        component="label">
                        Upload File
                        <input
                            type="file"
                            hidden
                            accept=".zip"
                            onChange={() => this.handleFileInput()}
                            ref={ref => this.inputRef = ref}
                        />
                    </Button>
                </Container>
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

const baseDropZoneStyle: CSS.Properties = {
    border: 'dotted',
    borderWidth: '3px',
    borderColor: '#37474f',
    width: '100%',
    maxWidth: '500px',
    height: '20%',
    maxHeight: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1em',
    marginBottom: '1em'
};

const inactiveDropZoneStyle: CSS.Properties = {
    ...baseDropZoneStyle,
    backgroundColor: '#37474f22'
}

const activeDropZoneStyle: CSS.Properties = {
    ...baseDropZoneStyle,
    backgroundColor: '#37474f49'
}
