import axios from "axios";
import BACKEND_URLS from "@/utils";
import { ProductCommentsResponse,ProductComment,CreateCommentPayload,CommentReply } from "@/types/comment";




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