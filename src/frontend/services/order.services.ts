import axios from "axios";
import BACKEND_URLS from "@/utils";


// ==========================================
// Bill
// ==========================================

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


// ==========================================
// Customer Order
// ==========================================

export interface CustomerOrderProduct {

    id: number;

    name: string;

    description: string;

    product_image: string | null;

    price: number;

}


export interface CustomerOrderItem {

    id: number;

    quantity: number;

    status: string;

    created: string;

    total: string;

    order: number;

    product: CustomerOrderProduct;

}


export async function getCustomerOrderItems(
    orderId: number
): Promise<CustomerOrderItem[]> {

    const response = await axios.get<CustomerOrderItem[]>(

        `${BACKEND_URLS}order/api/v1/order/item/list/${orderId}/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


export async function getCustomerOrderItemDetail(
    itemId: number
): Promise<CustomerOrderItem> {

    const response = await axios.get<CustomerOrderItem>(

        `${BACKEND_URLS}order/api/v1/order/item/detail/${itemId}/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


// ==========================================
// Order Detail
// ==========================================

export interface OrderProduct {

    id: number;

    name: string;

    description: string;

    quantity_in_stock: number;

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

    product: OrderProduct;

}


export interface OrderAddress {

    id: number;

    state: string;

    city: string;

    postal_code: string;

    customer: {

        username: string;

    };

}


// ==========================================
// Current Order / Cart
// ==========================================

export async function getOrderItems(): Promise<OrderItem[]> {

    const response = await axios.get<OrderItem[]>(

        `${BACKEND_URLS}order/api/v1/order/item/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


export async function getOrderAddresses(): Promise<OrderAddress[]> {

    const response = await axios.get<OrderAddress[]>(

        `${BACKEND_URLS}customer/api/v1/add/address/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


// ==========================================
// Checkout
// ==========================================

export async function createBill(
    addressId: number
) {

    const response = await axios.post(

        `${BACKEND_URLS}order/api/v1/bill/create/${addressId}/`,

        {},

        {
            withCredentials: true,
        }

    );

    return response.data;

}


// ==========================================
// Order Item Management
// ==========================================

export async function deleteOrderItem(
    itemId: number
): Promise<void> {

    await axios.delete(

        `${BACKEND_URLS}order/api/v1/order/item/detail/${itemId}/`,

        {
            withCredentials: true,
        }

    );

}


export async function updateOrderItem(
    itemId: number,
    quantity: number
) {

    const response = await axios.put(

        `${BACKEND_URLS}order/api/v1/order/item/detail/${itemId}/`,

        {
            quantity,
        },

        {
            withCredentials: true,
        }

    );

    return response.data;

}




export async function addOrderItem(
    productId: number | string,
    quantity: number
) {

    const { data } = await axios.post(
        `${BACKEND_URLS}order/api/v1/order/item/${productId}/`,
        {
            quantity,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}



export async function addProductToSessionCart(
    productId: number | string,
    quantity: number
) {
    const { data } = await axios.post(
        `${BACKEND_URLS}order/api/v1/session/cart/add/${productId}/`,
        {
            quantity,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}





// ==========================================
// Session Cart Interfaces
// ==========================================

export interface SessionProduct {
    id: number;
    name: string;
    description: string;
    quantity_in_stock: number;
    price: number;
    price_after: number;
    product_image: string | null;
    category: number;
    store: number;
}

export interface SessionCartItem {
    product: SessionProduct;
    quantity: number;
    total_price: number;
}

export interface SessionCartResponse {
    items: SessionCartItem[];
    total_quantity: number;
    total_price: number;
}


// ==========================================
// Get Session Cart
// ==========================================

export async function getSessionCart(): Promise<SessionCartResponse> {

    const { data } = await axios.get<SessionCartResponse>(
        `${BACKEND_URLS}order/api/v1/sessions/cart/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


// ==========================================
// Check Customer
// ==========================================

export async function getCustomerDetail() {

    const { data } = await axios.get(
        `${BACKEND_URLS}customer/api/v1/customer/detail/`,
        {
            withCredentials: true,
        }
    );

    return data;
}


// ==========================================
// Delete Session Cart Product
// ==========================================

export async function deleteSessionCartProduct(
    productId: number
): Promise<void> {

    await axios.delete(
        `${BACKEND_URLS}order/api/v1/session/cart/delete/${productId}/`,
        {
            withCredentials: true,
        }
    );
}


// ==========================================
// Update Session Cart Quantity
// ==========================================

export async function updateSessionCartQuantity(
    productId: number,
    quantity: number
) {

    const { data } = await axios.put(
        `${BACKEND_URLS}order/api/v1/session/cart/update/${productId}/`,
        {
            quantity,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}