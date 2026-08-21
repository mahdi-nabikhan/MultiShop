import axios from "axios";
import BACKEND_URLS from "@/utils";
import { Product,StoreResult,ProductImage,ProductResult,SearchResponse } from "@/types/product";




// ==========================================
// Get Product
// ==========================================

export async function getProduct(
    productId: string
): Promise<Product> {

    const { data } = await axios.get<Product>(

        `${BACKEND_URLS}website/api/v1/product/${productId}/`

    );

    return data;

}


// ==========================================
// Get Product Images
// ==========================================

export async function getProductImages(
    productId: string
): Promise<ProductImage[]> {

    const { data } = await axios.get<ProductImage[]>(

        `${BACKEND_URLS}website/api/v1/list/image/product/${productId}/`

    );

    return data;

}





export async function canRateProduct(
    productId: number
): Promise<boolean> {

    const { data } = await axios.get(
        `${BACKEND_URLS}customer/api/v1/product/${productId}/can-rate/`,
        {
            withCredentials: true,
        }
    );

    return data.can_rate;

}


export async function addProductRating(
    productId: number,
    rate: number
) {

    const { data } = await axios.post(
        `${BACKEND_URLS}customer/api/v1/add/product/rate/${productId}/`,
        {
            rate,
        },
        {
            withCredentials: true,
        }
    );

    return data;

}



export async function getStoreProducts(
    shopId: string,
    headers: Record<string, string> = {}
): Promise<Product[]> {

    const { data } = await axios.get<Product[]>(
        `${BACKEND_URLS}website/api/v1/product/list/${shopId}`,
        {
            headers,
        }
    );

    return data;
}



export async function getFilteredProducts(
    order: string
): Promise<Product[]> {

    const { data } = await axios.get<Product[]>(
        `${BACKEND_URLS}website/api/v1/product/filtering/`,
        {
            params: {
                order,
            },
        }
    );

    return data;
}



export async function getRandomProducts(): Promise<Product[]> {

    const { data } = await axios.get<Product[]>(
        `${BACKEND_URLS}website/api/v1/products/random/`
    );

    return data;
}






export async function searchProducts(
    query: string
): Promise<SearchResponse<ProductResult>> {

    const { data } = await axios.get<SearchResponse<ProductResult>>(
        `${BACKEND_URLS}website/api/v1/search/product/`,
        {
            params: {
                q: query,
            },
        }
    );

    return data;
}



export async function deleteProductDiscount(
    discountId: number
) {
    await axios.delete(
        `${BACKEND_URLS}vendor/api/v1/delete/discount/${discountId}/`,
        {
            withCredentials: true,
        }
    );
}