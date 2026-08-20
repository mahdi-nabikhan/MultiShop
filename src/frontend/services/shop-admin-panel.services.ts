import axios from "axios";
import BACKEND_URLS from "@/utils";


export interface CreateDiscountPayload {

    value: number;

    discount_type: "cash" | "percent";

}


export async function createProductDiscount(

    productId: number,

    payload: CreateDiscountPayload

) {

    const { data } = await axios.post(

        `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,

        payload,

        {

            withCredentials: true,

        }

    );

    return data;

}




export async function createProductImage(
    productId: number,
    formData: FormData
) {

    const { data } = await axios.post(
        `${BACKEND_URLS}vendor/api/v1/add/image/product/${productId}/`,
        formData,
        {
            withCredentials: true,
        }
    );

    return data;
}




export async function createProduct(formData: FormData) {
    const { data } = await axios.post(
        `${BACKEND_URLS}vendor/api/v1/add/product/`,
        formData,
        {
            withCredentials: true,
        }
    );

    return data;
}

export interface Message {

    id: number;

    conversation: number;

    sender: string | null;

    text: string | null;

    image: string | null;

    file: string | null;

    reply_to: number | null;

    is_read: boolean;

    is_edited: boolean;

    is_deleted: boolean;

    created_at: string;

    edited_at: string | null;

}



export async function getConversationMessages(
    conversationId: number
): Promise<Message[]> {

    const { data } = await axios.get<Message[]>(
        `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/list/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


export async function sendConversationMessage(
    conversationId: number,
    text: string
) {

    const { data } = await axios.post(
        `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/`,
        {
            text,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}

export interface AdminDetailProp {

    username: string;

    user: {

        email: string;

    };

}

export async function getShopAdmin(
    adminId: number | string
): Promise<AdminDetailProp> {

    const { data } = await axios.get<AdminDetailProp>(
        `${BACKEND_URLS}vendor/api/v1/shop/admin/detail/${adminId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


export async function deleteShopAdmin(
    adminId: number | string
) {

    const { data } = await axios.delete(
        `${BACKEND_URLS}vendor/api/v1/shop/admin/detail/${adminId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


export async function updateShopAdmin(
    adminId: number | string,
    username: string
) {

    const { data } = await axios.patch(
        `${BACKEND_URLS}vendor/api/v1/shop/admin/detail/${adminId}/`,
        {
            username,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}