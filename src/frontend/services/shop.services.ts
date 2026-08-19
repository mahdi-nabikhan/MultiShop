
import axios from "axios";
import BACKEND_URLS from "@/utils";
export interface StoreResult {
    id: number;
    name: string;
    description?: string;
    image?: string;
}
export interface SearchResponse<T> {
    success: boolean;
    count: number;
    results: T[];
}


export async function searchStores(
    query: string
): Promise<SearchResponse<StoreResult>> {

    const { data } = await axios.get<SearchResponse<StoreResult>>(
        `${BACKEND_URLS}vendor/api/v1/search/store/`,
        {
            params: {
                q: query,
            },
        }
    );

    return data;
}

export interface IStoreAddress {
    state: string;
    street: string;
}

export interface IGetStoreData {
    pk: number;
    image: string | null;
    description: string;
    name: string;
    address: IStoreAddress;
}

export async function getStoreDetail(
    shopId: string,
    headers?: Record<string, string>
): Promise<IGetStoreData> {

    const { data } = await axios.get<IGetStoreData>(
        `${BACKEND_URLS}website/api/v1/store/detail/${shopId}`,
        {
            headers,
        }
    );

    return data;
}




export interface Store {
    pk: number;
    name: string;
    description: string;
    image: string | null;
}

export interface StoreResponse {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: Store[];
}

export async function getStores(
    page: string,
    headers?: Record<string, string>
): Promise<StoreResponse> {

    const { data } = await axios.get<StoreResponse>(
        `${BACKEND_URLS}website/api/v1/store/list?page=${page}`,
        {
            headers,
        }
    );

    return data;
}




export interface StoreCategory {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

export async function getStoreCategories(): Promise<StoreCategory[]> {

    const { data } = await axios.get<StoreCategory[]>(
        `${BACKEND_URLS}vendor/api/v1/store/category/`
    );

    return data;
}




export interface CategoryStore {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
}

export async function getStoresByCategory(
    categoryId: number
): Promise<CategoryStore[]> {

    const { data } = await axios.get<CategoryStore[]>(
        `${BACKEND_URLS}vendor/api/v1/list/category/store/${categoryId}/`
    );

    return data;
}