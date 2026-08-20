import axios from "axios";
import BACKEND_URLS from "@/utils";


// ==========================================
// Comment Interface
// ==========================================

export interface ProductComment {

    id: number;

    content: string;

    created: string;

    product: number;

    customer: number;

}


// ==========================================
// Get Product Comments
// ==========================================

export interface ProductComment {
    id: number;
    descriptions: string;
    status: string;
    user: {
        id: number;
        email: string;
    };
    product: number;
    parent: number | null;
}

export interface ProductCommentsResponse {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: ProductComment[];
}


export async function getProductComments(
    productId: number | string,
    page: number
): Promise<ProductCommentsResponse> {

    const { data } = await axios.get<ProductCommentsResponse>(
        `${BACKEND_URLS}customer/api/v1/all/products/comments/${productId}/`,
        {
            params: {
                page,
            },
            withCredentials: true,
        }
    );

    return data;
}

// ==========================================
// Create Product Comment
// ==========================================

export async function createProductComment(

    productId: string,

    content: string

): Promise<ProductComment> {

    const { data } = await axios.post<ProductComment>(

        `${BACKEND_URLS}website/api/v1/product/${productId}/comments/`,

        {
            content,
        },

        {
            withCredentials: true,
        }

    );

    return data;

}




export interface CreateCommentPayload {
    descriptions: string;
    parent?: number;
}

export async function createComment(
    productId: string,
    payload: CreateCommentPayload
) {
    const { data } = await axios.post(
        `${BACKEND_URLS}customer/api/v1/add/comment/${productId}/`,
        payload,
        {
            withCredentials: true,
        }
    );

    return data;
}




export async function createCommentReply(
    commentId: number,
    productId: number | string,
    description: string
) {
    const { data } = await axios.post(
        `${BACKEND_URLS}customer/api/v1/add/get/comment/repaly/${commentId}/`,
        {
            descriptions: description,
            product: productId,
            parent: commentId,
        },
        {
            withCredentials: true,
        }
    );

    return data;
}





export interface CommentReply {
    id: number;
    descriptions: string;
    status: string;
    user: number;
    product: number;
    parent: number | null;
}

export async function getCommentReplies(
    commentId: number
): Promise<CommentReply[]> {

    const { data } = await axios.get<CommentReply[]>(
        `${BACKEND_URLS}customer/api/v1/add/get/comment/repaly/${commentId}/`,
        {
            withCredentials: true,
        }
    );

    return data;
}