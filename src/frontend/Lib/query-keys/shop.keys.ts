export const shopQueryKeys = {

    // =========================
    // Products
    // =========================

    products: () =>
        ["shop", "products"] as const,

    filteredProducts: (order: string) =>
        ["shop", "products", "filter", order] as const,

    product: (productId: number | string) =>
        ["shop", "product", productId] as const,

    productImages: (productId: number | string) =>
        ["shop", "product-images", productId] as const,
    storeProducts: (
        shopId: number | string,
        page: number,
        pageSize: number
    ) =>
        ["shop", "store-products", shopId, page, pageSize] as const,

    canRateProduct: (productId: number | string) =>
        ["shop", "can-rate-product", productId] as const,

    randomProducts: (
        page: number,
        pageSize: number
    ) => [
        "shop",
        "random-products",
        page,
        pageSize,
    ] as const,

    search: (searchQuery: string) =>
        ["shop", "search", searchQuery] as const,


    stores: (page: string) =>
        ["shop", "stores", page] as const,


    storeCategories: () =>
        ["shop", "store-categories"] as const,

};