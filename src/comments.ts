export interface CommentData {
    comment: {
        timestamp: number,
        comment: string,
        author: string,
        group: string
    }
}

export interface Comment {
    timestamp: number;
    title: string;
    data?: CommentData[];
}
