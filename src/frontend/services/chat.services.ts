import axios from "axios";
import BACKEND_URLS from "@/utils";
import { Conversation,Message } from "@/types/chat";


export async function getCustomerConversations(): Promise<Conversation[]> {
    const response = await axios.get<Conversation[]>(
        `${BACKEND_URLS}dashboard/api/v1/list/customer/conversation/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}





;





export async function getConversationMessages(
    conversationId: number
): Promise<Message[]> {

    const response = await axios.get<Message[]>(
        `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/list/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}


export async function sendConversationMessage(
    conversationId: number,
    text: string
): Promise<Message> {

    const response = await axios.post<Message>(
        `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/`,
        {
            text,
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
}