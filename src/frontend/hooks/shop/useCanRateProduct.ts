import { useQuery } from "@tanstack/react-query";

import { canRateProduct } from "@/services/product.services";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";


export default function useCanRateProduct(
    productId: number,
    isAuthenticated: boolean
) {

    return useQuery({
        queryKey:
            shopQueryKeys.canRateProduct(productId),

        queryFn: () =>
            canRateProduct(productId),

        enabled: isAuthenticated,
    });

}