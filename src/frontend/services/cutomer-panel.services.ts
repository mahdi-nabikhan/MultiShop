import axios from "axios";
import BACKEND_URLS from "@/utils";

export interface Customer {
    username: string;
}

export interface Address {
    id: number;
    state: string;
    city: string;
    postal_code: string;
    customer: Customer;
}

export interface CreateAddressRequest {
    state: string;
    city: string;
    postal_code: string;
}

export async function createAddress(
    data: CreateAddressRequest
) {
    const response = await axios.post(
        `${BACKEND_URLS}customer/api/v1/add/address/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function getAddresses(): Promise<Address[]> {
    const response = await axios.get<Address[]>(
        `${BACKEND_URLS}customer/api/v1/add/address/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}



export interface Customer {
    username: string;
}

export interface Address {
    id: number;
    state: string;
    city: string;
    postal_code: string;
    customer: Customer;
}


export async function getAddressDetail(
    addressId: number
): Promise<Address> {
    const response = await axios.get<Address>(
        `${BACKEND_URLS}customer/api/v1/detail/address/${addressId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}




export interface User {
    id: number;
    email: string;
}

export interface Comment {
    id: number;
    descriptions: string;
    status: string;
    user: User;
    product: number;
    parent: number | null;
}

export async function getCustomerComments(): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(
        `${BACKEND_URLS}customer/api/v1/all/comments/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}




export interface CustomerProfileProp {

    id: number;

    username: string;

    is_customer: boolean;

    user: number;

}


export async function getCustomerProfile(): Promise<CustomerProfileProp> {

    const response = await axios.get<CustomerProfileProp>(

        `${BACKEND_URLS}customer/api/v1/customer/detail/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


export async function updateCustomerProfile(
    data: { username: string }
): Promise<CustomerProfileProp> {

    const response = await axios.put<CustomerProfileProp>(

        `${BACKEND_URLS}customer/api/v1/customer/detail/`,

        data,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


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

export async function getCustomerTickets(): Promise<CustomerTicket[]> {

    const response = await axios.get<CustomerTicket[]>(
        `${BACKEND_URLS}dashboard/api/v1/customer/list/ticket/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}