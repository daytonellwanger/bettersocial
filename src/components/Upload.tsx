import React from 'react';
import CSS from 'csstype';
import JSZip from 'jszip';
import driveClient from '../DriveClient';

export default class Upload extends React.Component {

    private inputRef: HTMLInputElement | null = null;

    render() {
        return (
            <div>
                <p>Welcome to Social Freedom! To get started, upload your Facebook data file.</p>
                <div style={uploadContainerStyle}>
                    <div style={dropZoneStyle}
                        onDrop={(event) => this.handleDropFile(event)}
                        onDragOver={(event) => event.preventDefault()}>
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
        const zip = await JSZip.loadAsync(file!);
        await driveClient.uploadFiles(zip);
    }

}

const uploadContainerStyle: CSS.Properties = {
    width: '100%',
    height: '100%',
    paddingTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const dropZoneStyle: CSS.Properties = {
    backgroundColor: '#ddddea',
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
