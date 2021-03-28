import React, { useEffect, useState } from 'react';
import { CardMedia, Link } from '@material-ui/core';
import { getPhotoData, PhotoData } from '../../DriveClient';
import './Image.css';

interface P {
    uri: string;
    link?: boolean;
}

export default function Image(props: P) {

    const [photoData, setPhotoData] = useState<PhotoData>({ content: '', webViewLink: '', thumbnailLink: '' });

    useEffect(() => {
        async function fetchPhoto() {
            const photoData = await getPhotoData(props.uri);
            if (photoData) {
                setPhotoData(photoData);
            }
        }
        fetchPhoto();
    }, [props.uri]);


    if (photoData.webViewLink && !photoData.content) {
        if (props.link) {
            return (
                <Link href={photoData.webViewLink} target="_blank" rel="noopener noreferrer">
                    <CardMedia style={{ height: 0, paddingTop: '56.25%' }} className='video-thumbnail' image={photoData.thumbnailLink} />
                </Link>
            );
        } else {
            return <CardMedia style={{ height: 0, paddingTop: '56.25%' }} className='video-thumbnail' image={photoData.thumbnailLink} />;
        }
    } else {
        if (props.link) {
            return (
                <Link href={photoData.webViewLink} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                        style={{ height: 0, paddingTop: '56.25%' }}
                        image={`data:image/jpeg;base64,${btoa(photoData.content)}`} />
                </Link>
            );
        } else {
            return <CardMedia
                style={{ height: 0, paddingTop: '56.25%' }}
                image={`data:image/jpeg;base64,${btoa(photoData.content)}`} />;
        }
    }

}
