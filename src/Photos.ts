export interface Photo {
    uri: string;
    creation_timestamp: number;
    title: string;
    description?: string;
}

export interface Album {
    name: string;
    photos: Photo[];
    cover_photo: Photo;
    last_modified_timestamp: number;
    description: string;
}

export interface Video {
    uri: string;
    creation_timestamp: number;
    description: string;
}

export interface AlbumIndexEntry {
    name: string;
    numPhotos: number;
    photo: string;
    timestamp: number;
}

export interface AlbumIndex {
    albums: AlbumIndexEntry[];
}
