import axios from "axios";
import BACKEND_URLS from "@/utils";
import { Conversation } from "@/types/chat";


export async function getCustomerConversations(): Promise<Conversation[]> {
    const response = await axios.get<Conversation[]>(
        `${BACKEND_URLS}dashboard/api/v1/list/customer/conversation/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}
