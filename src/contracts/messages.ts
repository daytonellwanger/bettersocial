export interface ConversationFolder {
    name: string;
    id: string;
}

export interface Participant {
    name: string;
}

export interface Photo {
    uri: string;
    creation_timestamp: number;
}

export interface File {
    uri: string;
    creation_timestamp: number;
}

export interface Message {
    sender_name: string;
    timestamp_ms: number;
    photos?: Photo[];
    files?: File[];
    content?: string;
    type: string;
    is_unsent: boolean;
}

export type MessagePlus = Message & { fromSelf: boolean; };

export interface Conversation {
    title: string;
    participants: Participant[];
    messages: Message[];
    is_still_participant: boolean;
    thread_type: string;
    thread_path: string;
}

export interface ConversationIndexEntry {
    title: string;
    folderId: string;
}

export interface ConversationIndex {
    conversations: ConversationIndexEntry[];
}
