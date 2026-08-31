import { useQuery } from "@tanstack/react-query";

import { getStoreProducts } from "@/services/product.services";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { Product } from "@/types/product";

export default function useStoreProducts(shopId: string) {
    return useQuery<Product[]>({
        queryKey: shopQueryKeys.storeProducts(shopId),
        queryFn: () => getStoreProducts(shopId),
        enabled: !!shopId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}