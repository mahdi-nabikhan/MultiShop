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

export async function getProductComments(
    productId: string
): Promise<ProductComment[]> {

    const { data } = await axios.get<ProductComment[]>(

        `${BACKEND_URLS}website/api/v1/product/${productId}/comments/`

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