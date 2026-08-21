export interface Product {

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


// ==========================================
// Product Image Interface
// ==========================================

export interface ProductImage {

    id: number;

    product_image: string;

    title: string | null;

    description: string | null;

    product: number;

}
export interface StoreResult {
    id: number;
    name: string;
    description?: string;
    image?: string;
}

export interface ProductResult {
    id: number;
    name: string;
    price?: number;
}

export interface SearchResponse<T> {
    success: boolean;
    count: number;
    results: T[];
}