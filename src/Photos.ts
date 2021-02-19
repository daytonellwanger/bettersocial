export interface Photo {
    uri: string;
    creationTimestamp: number;
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
