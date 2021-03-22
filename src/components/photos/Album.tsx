import React, { useState } from 'react';
import { GridListTile, GridListTileBar, ListSubheader } from '@material-ui/core';
import driveClient, { getPhotoData } from '../../DriveClient';
import { getTimeString } from '../../util';
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
                    title={photo.description}
                    subtitle={getTimeString(photo.creation_timestamp)} />
            </GridListTile>
        );
    }

    return <ImageList
        fetchRequests={[() => fetchPhotos()]}
        renderItem={(photo: PhotoData) => renderPhoto(photo)}
        renderTitle={() => <ListSubheader component="a" href={folderLink} target="_blank" rel="noopener noreferrer">{props.location.state.name}</ListSubheader>} />;
}
