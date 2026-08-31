import { useQuery } from "@tanstack/react-query";

import { getProductImages } from "@/services/product.services";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { ProductImage } from "@/types/product";

export default function useProductImages(productId: string) {
    return useQuery<ProductImage[]>({
        queryKey: shopQueryKeys.productImages(productId),
        queryFn: () => getProductImages(productId),
        enabled: !!productId,
        staleTime: 2 * 60 * 1000,
    });
}