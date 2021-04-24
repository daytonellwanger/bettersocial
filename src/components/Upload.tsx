import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Typography } from '@material-ui/core';
import CSS from 'csstype';
import JSZip from 'jszip';
import { FileUploadFailure, uploadFiles } from '../upload';
import YourInfo from './YourInfo';

interface P {
    onUploadComplete: () => void;
}

interface S {
    uploading: boolean;
    progress: number;
    message: string;
    itemOverDropZone: boolean;
    zip?: JSZip;
    failedUploads?: FileUploadFailure[];
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
                <Container maxWidth="md" style={{ padding: '2em' }}>
                    <LinearProgress variant="determinate" color="secondary" value={this.state.progress * 100} style={{ marginBottom: '.5em' }} />
                    <Typography variant="caption" color="secondary">{this.state.message}</Typography>
                    {this.state.zip ? <YourInfo zip={this.state.zip} /> : undefined}
                    <Dialog
                        open={!!this.state.failedUploads}
                        onClose={() => this.setState({ failedUploads: undefined })}
                    >
                        <DialogTitle>Upload failed</DialogTitle>
                        <DialogContent>
                            <DialogContentText>The following files failed to upload:</DialogContentText>
                            {this.state.failedUploads?.map(f => (
                                <div>
                                    <DialogContentText>{f.file.name}</DialogContentText>
                                    <DialogContentText variant="caption">{f.failureReason.toString()}</DialogContentText>
                                </div>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({ failedUploads: undefined })} color="secondary">Report</Button>
                            <Button onClick={() => this.setState({ failedUploads: undefined })} color="secondary">Retry</Button>
                            <Button onClick={() => this.setState({ failedUploads: undefined })} color="secondary" autoFocus>Skip</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            );
        } else {
            return (
                <Container style={{ padding: '2em' }} maxWidth="sm">
                    <Typography color="secondary" variant="body1">Welcome to Social Freedom! To get started, upload your data.</Typography>
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
                        color="primary"
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
        this.setState({ zip });
        const failedUploads = await uploadFiles(zip, (progress, message) => this.setState({ progress, message }));
        if (failedUploads) {
            this.setState({ failedUploads });
        } else {
            this.props.onUploadComplete();
        }
    }

}

const baseDropZoneStyle: CSS.Properties = {
    border: 'dotted',
    borderWidth: '3px',
    borderColor: '#37474f',
    width: '100%',
    height: '150px',
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
