export interface CustomerTicketCustomer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

export interface CustomerTicket {
    pk: number;
    title: string;
    content: string;
    store: number;
    customer: CustomerTicketCustomer;
}
