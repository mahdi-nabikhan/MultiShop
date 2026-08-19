import axios from "axios";
import BACKEND_URLS from "@/utils";

export interface Cart {
    id: number;
    status: boolean;
    created: string;
    customer: number;
}

export interface Bill {
    id: number;
    created_at: string;
    status: boolean;
    cart: Cart;
    address: number;
}

export async function getBills(): Promise<Bill[]> {
    const response = await axios.get<Bill[]>(
        `${BACKEND_URLS}order/api/v1/bill/list/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}





export interface Product {

    id: number;

    name: string;

    description: string;

    product_image: string;

    price: number;

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


export async function getCustomerOrderItems(
    orderId: number
): Promise<OrderItem[]> {

    const response = await axios.get<OrderItem[]>(
        `${BACKEND_URLS}order/api/v1/order/item/list/${orderId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}


export async function getCustomerOrderItemDetail(
    itemId: number
): Promise<OrderItem> {

    const response = await axios.get<OrderItem>(
        `${BACKEND_URLS}order/api/v1/order/item/detail/${itemId}/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}