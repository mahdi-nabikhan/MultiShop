import { useQuery } from "@tanstack/react-query";

import { getFilteredProducts } from "@/services/product.services";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { Product } from "@/types/product";

export default function useFilteredProducts(order: string) {
    return useQuery<Product[]>({
        queryKey: shopQueryKeys.filteredProducts(order),
        queryFn: () => getFilteredProducts(order),
        enabled: !!order,
    });
}