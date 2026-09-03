import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getStoreProducts } from "@/services/product.services";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { Product } from "@/types/product";

interface PaginatedResponse<T> {
    links: {
        next: string | null;
        previous: string | null;
    };
    count: number;
    results: T[];
}

export default function useStoreProducts(
    shopId: string,
    page: number,
    pageSize: number = 8
) {

    return useQuery<PaginatedResponse<Product>>({

        queryKey: shopQueryKeys.storeProducts(
            shopId,
            page,
            pageSize
        ),

        queryFn: () =>
            getStoreProducts(
                shopId,
                page,
                pageSize
            ),

        enabled: !!shopId,

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,

    });

}