import axios from "axios";
import BACKEND_URLS from "@/utils";
import type { Bill,Cart,CustomerOrderItem,OrderAddress,OrderItem,SessionCartResponse,Order} from "@/types/order";

// ==========================================
// Bill
// ==========================================


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



export async function getCustomerOrders(): Promise<Order[]> {

    const response = await axios.get<Order[]>(
        `${BACKEND_URLS}order/api/v1/orders/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}