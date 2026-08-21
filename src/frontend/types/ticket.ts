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




export interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}


export interface CustomerTicketDetailProp {
    pk: number;
    title: string;
    content: string;
    store: number;
    customer: Customer;
}


export interface TicketReplyProp {
    pk: number;
    content: string;
}


export 
interface Ticket {


    pk:number;
    title:string;
    content:string;
    store:number;


}
