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


export interface DiscountData {
    id: number;
    products: number;
    value: number;
    discount_type: "cash" | "percent";
}


export async function getProductDiscounts(
    productId: number
): Promise<DiscountData[]> {

    const { data } = await axios.get<DiscountData[]>(
        `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}



export async function updateProduct(
    productId: number,
    formData: FormData
) {

    const { data } = await axios.patch(
        `${BACKEND_URLS}vendor/api/v1/detail/product/${productId}/`,
        formData,
        {
            withCredentials: true,
        }
    );

    return data;
}


export interface Admin {
    id:number
    username: string;
    user: {

        email: string;
    };
}


export async function getAdmins(): Promise<Admin[]> {

    const { data } = await axios.get<Admin[]>(
        `${BACKEND_URLS}vendor/api/v1/shop/admin/list/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


export interface Conversation {
    id: number;
    store: number;
    customer: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}



export async function getStoreConversations(): Promise<Conversation[]> {

    const { data } = await axios.get<Conversation[]>(
        `${BACKEND_URLS}dashboard/api/v1/list/store/conversations/`,
        {
            withCredentials: true,
        }
    );

    return data;
}



export interface OperatorDetail {
    username: string;
    user: {
        email: string;
    };
}
export async function getOperatorDetail(
    operatorId: number | string
): Promise<OperatorDetail> {

    const { data } = await axios.get<OperatorDetail>(
        `${BACKEND_URLS}vendor/api/v1/shop/operator/detail/${operatorId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}



export interface Operator {
    username: string;
    user: {
        email: string;
    };
}




export async function getOperators(): Promise<Operator[]> {

    const { data } = await axios.get<Operator[]>(
        `${BACKEND_URLS}vendor/api/v1/shop/operator/list/`,
        {
            withCredentials: true,
        }
    );

    return data;
}





export interface Product {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: string;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}

export interface OrderItem {
    id: number;
    quantity: number;
    status: string;
    created: string;
    total: string;
    order: number;
    product: Product;
}

export async function getOrderItems(
    orderId: number | string
): Promise<OrderItem[]> {

    const { data } = await axios.get<OrderItem[]>(
        `${BACKEND_URLS}order/api/v1/related/order/orderitem/${orderId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}



interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

export interface Order {
    pk: number;
    status: boolean;
    customer: Customer;
}



export async function getShopOrders(): Promise<Order[]> {

    const { data } = await axios.get<Order[]>(
        `${BACKEND_URLS}vendor/api/v1/shop/list/order/`,
        {
            withCredentials: true,
        }
    );

    return data;
}