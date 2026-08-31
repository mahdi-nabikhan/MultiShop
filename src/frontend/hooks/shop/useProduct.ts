import { useQuery } from "@tanstack/react-query";

import { getProduct } from "@/services/product.services";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { Product } from "@/types/product";

export default function useProduct(productId: string) {
    return useQuery<Product>({
        queryKey: shopQueryKeys.product(productId),
        queryFn: () => getProduct(productId),
        enabled: !!productId,
    });
}