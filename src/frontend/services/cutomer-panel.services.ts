import axios from "axios";
import BACKEND_URLS from "@/utils";
import type { CreateAddressRequest,Address, Address2 } from "@/types/address";
import type { CustomerProfileProp } from "@/types/customer";
import type{ CustomerTicket } from "@/types/ticket";
import type { Comment } from "@/types/comment";


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






interface PaginatedResponse<T> {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: T[];
}

export async function getCustomerComments(
    page: number,
    pageSize: number
): Promise<PaginatedResponse<Comment>> {
    const response = await axios.get<PaginatedResponse<Comment>>(
        `${BACKEND_URLS}customer/api/v1/all/comments/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return response.data;
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



interface PaginatedResponse<T> {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: T[];
}

export async function getCustomerTickets(
    page: number,
    pageSize: number
): Promise<PaginatedResponse<CustomerTicket>> {

    const response = await axios.get<
        PaginatedResponse<CustomerTicket>
    >(
        `${BACKEND_URLS}dashboard/api/v1/customer/list/ticket/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return response.data;
}

export async function getCommentDetail(
    commentId: number
): Promise<Comment> {

    const response = await axios.get<Comment>(
        `${BACKEND_URLS}customer/api/v1/detail/comment/${commentId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}




export async function deleteAddress(
    addressId: number
): Promise<void> {

    await axios.delete(
        `${BACKEND_URLS}customer/api/v1/detail/address/${addressId}/`,
        {
            withCredentials: true,
        }
    );

}




export async function updateAddress(
    addressId: number,
    data: {
        state: string;
        city: string;
        postal_code: string;
    }
): Promise<Address2> {

    const response = await axios.put<Address2>(
        `${BACKEND_URLS}customer/api/v1/detail/address/${addressId}/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}