import axios from "axios";
import BACKEND_URLS from "@/utils";

export interface Conversation {
    id: number;
    customer: number;
    customer_name: string;
    store: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export async function getCustomerConversations(): Promise<Conversation[]> {
    const response = await axios.get<Conversation[]>(
        `${BACKEND_URLS}dashboard/api/v1/list/customer/conversation/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}