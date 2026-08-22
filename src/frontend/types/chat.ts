export interface Conversation {
    id: number;
    customer: number;
    customer_name: string;
    store: number;
    status: string;
    created_at: string;
    updated_at: string;
}



export interface Message {
    id: number;
    conversation: number;
    sender: string;
    text: string;
    image: string | null;
    file: string | null;
    reply_to: number | null;
    is_read: boolean;
    is_edited: boolean;
    is_deleted: boolean;
    created_at: string;
    edited_at: string | null;
}
export interface MessageProp {
    id: number;
    conversation: number;
    text: string;
    image: string | null;
    file: string | null;
    created_at: string;
    sender: string;
    is_read: boolean;
}