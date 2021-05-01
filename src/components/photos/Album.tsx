import React, { useState } from 'react';
import { Button, GridListTile, GridListTileBar, Link, Tooltip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import driveClient, { getPhotoData } from '../../DriveClient';
import { decodeString, getTimeString } from '../../util';
import { Album as AlbumData, Photo as PhotoData } from '../../contracts/photos';
import Image from '../util/Image';
import ImageList from '../util/ImageList';

interface P {
    location: {
        state: {
            id: string;
            name: string;
        }
    }
}

export default function Album(props: P) {

    const [folderLink, setFolderLink] = useState<string | undefined>(undefined);

    async function fetchPhotos() {
        if (props.location.state.id === 'videos') {
            const videos = await driveClient.getVideos();
            const album: AlbumData = {
                cover_photo: {} as any,
                description: '',
                last_modified_timestamp: 0,
                name: 'Videos',
                photos: videos.videos.map(v => ({
                    ...v,
                    title: ''
                }))
            };
            setFolderLink(videos.videosFolderLink);
            return album.photos;
        } else {
            const album: AlbumData = (await gapi.client.drive.files.get({ fileId: props.location.state.id, alt: 'media' })).result as AlbumData;
            const folderLink = (await getPhotoData(album.cover_photo.uri, true))?.parentFolderLink!;
            setFolderLink(folderLink);
            return album.photos;
        }
    }

    function renderPhoto(photo: PhotoData) {
        return (
            <GridListTile key={photo.uri}>
                <Image uri={photo.uri} link={true} />
                <GridListTileBar
                    title={decodeString(photo.description || '')}
                    subtitle={getTimeString(photo.creation_timestamp)} />
            </GridListTile>
        );
    }

    return <ImageList
        fetchRequests={[() => fetchPhotos()]}
        renderItem={(photo: PhotoData) => renderPhoto(photo)}
        renderTitle={() => (
            <Tooltip title="View on Google Drive">
                <Link rel="noopener noreferrer" href={folderLink} target="_blank">
                    <Button color="secondary" style={{ marginBottom: '1em' }} endIcon={<OpenInNewIcon />}>{decodeString(props.location.state.name)}</Button>
                </Link>
            </Tooltip>
        )} />;
}
