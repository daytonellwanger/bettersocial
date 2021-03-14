export interface PostData {
    post: string;
}

export type Data = PostData | any;

export interface ExternalContextAttachmentData {
    external_context: {
        url: string
    };
}

export interface MediaAttachmentData {
    media: {
        title: string,
        description: string,
        uri: string,
        content: string,
        webViewLink: string
    };
}

export type AttachmentData = ExternalContextAttachmentData | MediaAttachmentData;

export interface Post {
    timestamp: number;
    title?: string;
    data?: Data[];
    tags?: string[]
}

export interface PostWithAttachment extends Post {
    attachments: {
        data: AttachmentData[]
    }[];
}
