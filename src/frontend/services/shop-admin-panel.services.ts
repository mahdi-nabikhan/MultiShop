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



export interface ProductImage {

    id: number;

    product_image: string;

    title: string | null;

    description: string | null;

    product: number;

}


export async function getProductImages(
    productId: number
): Promise<ProductImage[]> {

    const { data } = await axios.get<ProductImage[]>(
        `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`
    );

    return data;

}



export async function deleteProduct(
    productId: number
): Promise<void> {

    await axios.delete(
        `${BACKEND_URLS}vendor/api/v1/detail/product/${productId}/`,
        {
            withCredentials: true,
        }
    );

}


export type Role =
    "manager" |
    "admin" |
    "operator";


export async function getUserRole(): Promise<Role> {

    const response = await axios.get(

        `${BACKEND_URLS}vendor/api/v1/store/user/roles/`,

        {
            withCredentials: true,
        }

    );

    return response.data.role;

}


export async function getProfile(
    role: Role
) {

    const response = await axios.get(

        `${BACKEND_URLS}vendor/api/v1/${role}/detail/`,

        {
            withCredentials: true,
        }

    );

    return response.data;

}


export async function updateProfile(
    role: Role,
    data: any
) {

    const response = await axios.put(

        `${BACKEND_URLS}vendor/api/v1/${role}/detail/`,

        data,

        {
            withCredentials: true,
        }

    );

    return response.data;

}



export async function getOrderItemDetail(
    orderItemId: number | string
): Promise<OrderItem> {

    const response = await axios.get<OrderItem>(

        `${BACKEND_URLS}order/api/v1/order/item/detail/${orderItemId}/`,

        {
            withCredentials: true,
        }

    );

    return response.data;
}


export interface ShopProductData {

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


export interface ProductImage {

    id: number;

    product_image: string;

    title: string | null;

    description: string | null;

    product: number;

}


export async function getShopProductDetail(
    productId: number
): Promise<ShopProductData> {

    const response =
        await axios.get<ShopProductData>(

            `${BACKEND_URLS}vendor/api/v1/detail/product/${productId}/`,

            {
                withCredentials: true,
            }

        );

    return response.data;

}


export async function getShopProductImages(
    productId: number
): Promise<ProductImage[]> {

    const response =
        await axios.get<ProductImage[]>(

            `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`

        );

    return response.data;

}


export async function deleteProductImage(
    imageId: number
): Promise<void> {

    await axios.delete(

        `${BACKEND_URLS}vendor/api/v1/delete/images/${imageId}/`,

        {
            withCredentials: true,
        }

    );

}





export interface ShopProductListData {
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

export async function getShopProducts(
    cookie: string
): Promise<ShopProductListData[]> {

    const response = await axios.get<ShopProductListData[]>(
        `${BACKEND_URLS}vendor/api/v1/all/product/shop/`,
        {
            headers: {
                Cookie: cookie,
            },
        }
    );

    return response.data;
}




export interface Ticket {
    pk: number;
    title: string;
    content: string;
    store: number;
    customer: {
        id: number;
        username: string;
        is_customer: boolean;
        user: number;
    };
}

export async function getShopTickets(): Promise<Ticket[]> {

    const response = await axios.get<Ticket[]>(
        `${BACKEND_URLS}dashboard/api/v1/shop/all/ticket/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}







export interface StoreData {
    pk: number;
    image: string | null;
    description?: string;
    name?: string;
}

export interface StoreFormData {
    name: string;
    description: string;
}

export async function getStoreProfile(): Promise<StoreData> {

    const response = await axios.get<StoreData>(
        `${BACKEND_URLS}vendor/api/v1/store/detail/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
}


export async function updateStoreProfile(
    data: StoreFormData
): Promise<StoreData> {

    const response = await axios.put<StoreData>(
        `${BACKEND_URLS}vendor/api/v1/store/detail/`,
        data,
        {
            withCredentials: true,
        }
    );

    return response.data;
}
export interface Reply {

    id: number;

    content: string;

    created: string;

}


export async function getTicketReplies(
    ticketId: number
): Promise<Reply[]> {

    const response = await axios.get<Reply[]>(

        `${BACKEND_URLS}dashboard/api/v1/replay/ticket/${ticketId}/`,

        {
            withCredentials: true,
        }

    );

    return response.data;
}