import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, Link, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CSS from 'csstype';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { appInsights, reactPlugin } from '../AppInsights';
import { Uploader } from '../upload';
import YourInfo from './YourInfo';

const zip = (window as any).zip;

interface P {
    onUploadComplete: () => void;
}

interface S {
    uploading: boolean;
    progress: number;
    message: string;
    itemOverDropZone: boolean;
    zips?: any[];
    invalidInput: boolean;
    browserNotSupported: boolean;
    uploadFailed: boolean;
}

class Upload extends React.Component<P, S> {

    state: S = {
        uploading: false,
        progress: 0,
        message: '',
        itemOverDropZone: false,
        invalidInput: false,
        browserNotSupported: false,
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
                    {this.state.zips ? <YourInfo zips={this.state.zips} /> : undefined}
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
                            <Button component={Link} href="https://www.socialfreedom.life/feedback" target="_blank" color="secondary">Report</Button>
                            <Button onClick={async () => {
                                appInsights.trackEvent({ name: 'RetryUpload' });
                                this.setState({ uploadFailed: false });
                                const uploadSuccess = await this.uploader!.retryFailedFiles();
                                if (uploadSuccess) {
                                    this.props.onUploadComplete();
                                } else {
                                    this.setState({ uploadFailed: true });
                                }
                            }} color="secondary">Retry</Button>
                            <Button onClick={async () => {
                                appInsights.trackEvent({ name: 'SkipUpload' });
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
                        <Typography color="textSecondary" variant="caption">Drag and drop .zip here</Typography>
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
                            multiple
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
                            <Typography>• Go to <Link href="https://facebook.com/dyi/" target="_blank" color="secondary" underline="always">facebook.com/dyi</Link></Typography>
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
                            <Typography>Nothing! We upload <Box fontWeight="500" display='inline'>your</Box> data to <Box fontWeight="500" display='inline'>your</Box> Google Drive. We have no servers of our own. When you visit this site, we read the data from your Google Drive and render it in your browser. It never goes anywhere else. You can read more <Link href="https://www.socialfreedom.life/mydata#how-it-works" target="_blank" color="secondary" underline="always">here</Link>. See below for the promises Google makes regarding your data privacy.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Google's privacy policy</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{ marginLeft: '1em', marginRight: '1em' }}>
                            <Typography><Link href="https://www.google.com/drive/terms-of-service/" target="_blank" color="secondary" underline="always">Google Drive's Terms of Service</Link> state that "your content remains yours." In addition, according to <Link href="https://policies.google.com/privacy" target="_blank" color="secondary" underline="always">Google's Privacy Policy</Link>, your data is not shared with anyone else except your domain administrator, in the case that you have an organizational account, or in the case of legal matters.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Dialog open={this.state.invalidInput} onClose={() => this.setState({ invalidInput: false })}>
                        <DialogTitle>Invalid input</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Looks like you didn't upload valid Facebook data. Make sure you've selected the .zip file you got from <Link href="https://facebook.com/dyi/" target="_blank" color="secondary">facebook.com/dyi</Link>, and make sure you set <Box fontWeight="500" display='inline'>Format</Box> to <Box fontWeight="500" display='inline'>JSON</Box> when requesting your data. See "How to get your data from Facebook" below.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button component={Link} href="https://www.socialfreedom.life/feedback" target="_blank" color="secondary">Report an issue</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={this.state.browserNotSupported} onClose={() => this.setState({ browserNotSupported: false })}>
                        <DialogTitle>Browser not supported</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Looks like you're trying to upload a large file. Safari can't currently handle this. Try on Chrome, Firefox, Edge, or Opera.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button component={Link} href="https://www.socialfreedom.life/feedback" target="_blank" color="secondary">Report an issue</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            );
        }
    }

    private async handleDropFile(event: React.DragEvent) {
        event.preventDefault();
        const files: File[] = [];
        if (event.dataTransfer.items) {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                const item = event.dataTransfer.items[i];
                if (item.kind !== 'file') {
                    continue;
                }
                files.push(item.getAsFile()!);
            }
        } else {
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                files.push(event.dataTransfer.files[i]);
            }
        }
        await this.uploadFile(files);
    }

    private async handleFileInput() {
        const files: File[] = [];
        if (!this.inputRef?.files) {
            return;
        }
        for (let i = 0; i < this.inputRef.files.length; i++) {
            files.push(this.inputRef.files[i]);
        }
        await this.uploadFile(files);
    }

    private async uploadFile(files: File[]) {
        appInsights.trackEvent({ name: 'StartUpload' });
        this.setState({ uploading: true, progress: 0, message: 'Unzipping' });
        const zips: any[] = [];
        for (let f of files) {
            zips.push(new zip.ZipReader(new zip.BlobReader(f)));
        }
        this.uploader = new Uploader(zips, (progress, message) => this.setState({ progress, message }));
        let validInput = true;
        try {
            validInput = await this.uploader.preUpload();
        } catch (e) {
            this.setState({ uploading: false, progress: 0, message: '', browserNotSupported: true });
            return;
        }
        if (!validInput) {
            this.setState({ uploading: false, progress: 0, message: '', invalidInput: true });
            return;
        }
        this.setState({ zips });
        const uploadSuccessful = await this.uploader.upload();
        if (uploadSuccessful) {
            appInsights.trackEvent({ name: 'UploadSuccessful' });
            this.props.onUploadComplete();
        } else {
            appInsights.trackEvent({ name: 'UploadFailed', properties: { numFailures: this.uploader!.failedUploads.length, failureReason: this.uploader!.failedUploads[0]?.failureReason.toString() }})
            this.setState({ uploadFailed: true });
        }
    }

}

export default withAITracking(reactPlugin, Upload, 'Upload');

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
