import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Link, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CSS from 'csstype';
import JSZip from 'jszip';
import { Uploader } from '../upload';
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
    invalidInput: boolean;
    uploadFailed: boolean;
}

export default class Upload extends React.Component<P, S> {

    state: S = {
        uploading: false,
        progress: 0,
        message: '',
        itemOverDropZone: false,
        invalidInput: false,
        uploadFailed: false
    };

    private uploader: Uploader | undefined;
    private inputRef: HTMLInputElement | null = null;

    render() {
        if (this.state.uploading) {
            return (
                <Container maxWidth="md" style={{ padding: '2em' }}>
                    <LinearProgress variant="determinate" color="secondary" value={this.state.progress * 100} style={{ marginBottom: '.5em' }} />
                    <Typography variant="caption" color="secondary">{this.state.message}</Typography>
                    <Typography variant="body1" color="secondary" style={{ marginTop: '1em', marginBottom: '1em' }}>This may take a while. You can go do something else, but make sure to keep this tab open until the upload completes.</Typography>
                    {this.state.zip ? <YourInfo zip={this.state.zip} /> : undefined}
                    <Dialog open={this.state.uploadFailed}>
                        <DialogTitle>Upload failed</DialogTitle>
                        <DialogContent>
                            <DialogContentText>The following files failed to upload:</DialogContentText>
                            {this.uploader?.failedUploads.map(f => (
                                <div>
                                    <DialogContentText>{f.file.name}</DialogContentText>
                                    <DialogContentText variant="caption">{f.failureReason.toString()}</DialogContentText>
                                </div>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button component={Link} href="https://www.socialfreedom.life/complain" target="_blank" color="secondary">Report</Button>
                            <Button onClick={async () => {
                                this.setState({ uploadFailed: false });
                                const uploadSuccess = await this.uploader!.retryFailedFiles();
                                if (uploadSuccess) {
                                    this.props.onUploadComplete();
                                } else {
                                    this.setState({ uploadFailed: true });
                                }
                            }} color="secondary">Retry</Button>
                            <Button onClick={async () => {
                                this.setState({ uploadFailed: false });
                                await this.uploader!.finishUpload();
                                this.props.onUploadComplete();
                            }} color="secondary" autoFocus>Skip</Button>
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
                    <Accordion style={{ marginTop: '1.5em' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>How to get your data from Facebook</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ display: 'flex', flexDirection: 'column', marginLeft: '1em', marginRight: '1em' }}>
                            <Typography>• Go to <Link href="https://facebook.com/dyi/" target="_blank" color="secondary">facebook.com/dyi</Link></Typography>
                            <Typography>• Set <Box fontWeight="500" display='inline'>Format</Box> to <Box fontWeight="500" display='inline'>JSON</Box></Typography>
                            <Typography>• Click "Create File"</Typography>
                            <Typography>• Wait for Facebook to notify you that your data is ready</Typography>
                            <Typography>• Download the .zip file</Typography>
                            <Typography>• Drag and drop it here</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>What we do with your data</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ marginLeft: '1em', marginRight: '1em' }}>
                            <Typography>Nothing! We upload <Box fontWeight="500" display='inline'>your</Box> data to <Box fontWeight="500" display='inline'>your</Box> Google Drive. We have no servers of our own. When you visit this site, we read the data from your Google Drive and render it in your browser. It never goes anywhere else. See below for the promises Google makes regarding your data privacy.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Google's privacy policy</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ marginLeft: '1em', marginRight: '1em' }}>
                            <Typography><Link href="https://www.google.com/drive/terms-of-service/" target="_blank" color="secondary">Google Drive's Terms of Service</Link> state that "your content remains yours." In addition, according to <Link href="https://policies.google.com/privacy" target="_blank" color="secondary">Google's Privacy Policy</Link>, your data is not shared with anyone else except your domain administrator, in the case that you have an organizational account, or in the case of legal matters.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Dialog open={this.state.invalidInput} onClose={() => this.setState({ invalidInput: false })}>
                        <DialogTitle>Invalid input</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Looks like you didn't upload valid Facebook data. Make sure you've selected the .zip file you got from <Link href="https://facebook.com/dyi/" target="_blank" color="secondary">facebook.com/dyi</Link>, and make sure you set <Box fontWeight="500" display='inline'>Format</Box> to <Box fontWeight="500" display='inline'>JSON</Box> when requesting your data. See "How to get your data from Facebook" below.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button component={Link} href="https://www.socialfreedom.life/complain" target="_blank" color="secondary" onClick={() => this.setState({ invalidInput: false })}>Report an issue</Button>
                        </DialogActions>
                    </Dialog>
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
        this.uploader = new Uploader(zip, (progress, message) => this.setState({ progress, message }));
        const validInput = this.uploader.preUpload();
        if (!validInput) {
            this.setState({ uploading: false, progress: 0, message: '', invalidInput: true });
            return;
        }
        this.setState({ zip });
        const uploadSuccessful = await this.uploader.upload();
        if (uploadSuccessful) {
            this.props.onUploadComplete();
        } else {
            this.setState({ uploadFailed: true });
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
