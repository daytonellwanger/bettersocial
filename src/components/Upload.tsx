import React from 'react';
import JSZip from 'jszip';
import driveClient from '../DriveClient';

export default class Upload extends React.Component {

    private inputRef: HTMLInputElement | null = null;

    render() {
        return (
            <div>
                <form>
                    <p>Upload data</p>
                    <input
                        type="file"
                        accept=".zip"
                        onChange={() => this.handleFile()}
                        ref={ref => this.inputRef = ref} />
                </form>
            </div>
        );
    }

    async handleFile() {
        const file = this.inputRef?.files?.item(0);
        if (file) {
            const zip = await JSZip.loadAsync(file!);
            driveClient.uploadFiles(zip);
        }
    }

}
