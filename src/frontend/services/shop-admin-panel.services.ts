import axios from "axios";
import BACKEND_URLS from "@/utils";
import { CreateDiscountPayload,AdminDetailProp,Admin
    ,Conversation,DiscountData,Message
    ,Operator,OperatorDetail,Order,OrderItem
    ,ProductImage,Reply,ShopProductData,
    ShopProductListData,StoreData,
    StoreFormData,Ticket } from "@/types/panel-admin";


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





interface PaginatedResponse<T> {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: T[];
}

export async function getProductDiscounts(
    productId: number,
    page: number,
    pageSize: number
): Promise<PaginatedResponse<DiscountData>> {

    const { data } = await axios.get<
        PaginatedResponse<DiscountData>
    >(
        `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
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




export async function getAdmins(
    page: number,
    pageSize: number
): Promise<PaginatedResponse<Admin>> {

    const { data } = await axios.get<PaginatedResponse<Admin>>(
        `${BACKEND_URLS}vendor/api/v1/shop/admin/list/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return data;
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







export async function getOperators(
    page: number,
    pageSize: number
): Promise<PaginatedResponse<Operator>> {

    const { data } = await axios.get<PaginatedResponse<Operator>>(
        `${BACKEND_URLS}vendor/api/v1/shop/operator/list/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return data;
}






export async function getOrderItems(
    orderId: number | string,
    page: number,
    pageSize: number
): Promise<PaginatedResponse<OrderItem>> {

    const { data } = await axios.get<
        PaginatedResponse<OrderItem>
    >(
        `${BACKEND_URLS}order/api/v1/related/order/orderitem/${orderId}/`,
        {
            withCredentials: true,
            params: {
                page,
                page_size: pageSize,
            },
        }
    );

    return data;
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






export async function getShopProducts(): Promise<ShopProductListData[]> {
    const response = await axios.get<ShopProductListData[]>(
        `${BACKEND_URLS}vendor/api/v1/all/product/shop/`,
        {
            withCredentials: true,
        }
    );

    return response.data;
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