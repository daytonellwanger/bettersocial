import React from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { decodeString, getTimeString } from '../../util';
import driveClient from '../../DriveClient';
import { AlbumIndexEntry } from '../../contracts/photos';
import Image from '../util/Image';
import ImageList from '../util/ImageList';

export default function Photos() {

    function renderAlbum(album: AlbumIndexEntry) {
        return (
            <GridListTile key={album.id}>
                <Link to={{ pathname: '/album', state: { id: album.id, name: album.name } }}>
                    <Image uri={album.photo} />
                </Link>
                <GridListTileBar
                    title={decodeString(album.name)}
                    subtitle={getTimeString(album.timestamp)} />
            </GridListTile>
        );
    }

    return <ImageList 
                fetchRequests={[async () => {
                    const albums = [...(await driveClient.getAlbumFiles())];
                    try {
                        const videoAlbum = await getVideosAlbum();
                        albums.push(videoAlbum);
                    } catch {}
                    return albums;
                }]}
                renderItem={(album: AlbumIndexEntry) => renderAlbum(album)} />;
}

async function getVideosAlbum() {
    const videos = await driveClient.getVideos();
    const album: AlbumIndexEntry = {
        id: 'videos',
        name: 'Videos',
        numPhotos: videos.videos.length,
        photo: videos.videos[0].uri,
        timestamp: Math.max(-1, ...videos.videos.map(v => v.creation_timestamp))
    };
    return album;
}
