import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getRandomProducts } from "@/services/product.services";
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

export default function useRandomProducts(
    page: number,
    pageSize: number = 8
) {

    return useQuery<PaginatedResponse<Product>>({

        queryKey:
            shopQueryKeys.randomProducts(
                page,
                pageSize
            ),

        queryFn: () =>
            getRandomProducts(
                page,
                pageSize
            ),

        placeholderData:
            keepPreviousData,

        staleTime:
            5 * 60 * 1000,

        gcTime:
            15 * 60 * 1000,

    });

}