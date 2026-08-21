import axios from "axios";
import BACKEND_URLS from "@/utils";
import { CustomerTicketDetailProp,Ticket,TicketReplyProp } from "@/types/ticket";

export async function getCustomerTicketDetail(
    ticketId: number
): Promise<CustomerTicketDetailProp> {

    const response = await axios.get<CustomerTicketDetailProp>(
        `${BACKEND_URLS}dashboard/api/v1/detail/ticket/${ticketId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}


export async function getCustomerTicketReplies(
    ticketId: number
): Promise<TicketReplyProp[]> {

    const response = await axios.get<TicketReplyProp[]>(
        `${BACKEND_URLS}dashboard/api/v1/replay/ticket/${ticketId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}




export async function deleteCustomerTicket(
    ticketId: number
): Promise<void> {

    await axios.delete(
        `${BACKEND_URLS}dashboard/api/v1/detail/ticket/${ticketId}/`,
        {
            withCredentials: true,
        }
    );

}


export async function updateCustomerTicket(
    ticketId: number,
    data: {
        title: string;
        content: string;
        store: number;
    }
): Promise<Ticket> {

    const response = await axios.put<Ticket>(
        `${BACKEND_URLS}dashboard/api/v1/detail/ticket/${ticketId}/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}