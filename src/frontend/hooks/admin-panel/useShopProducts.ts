import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { getShopProducts } from "@/services/shop-admin-panel.services";

export default function useShopProducts(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.products(page, pageSize),

        queryFn: () => getShopProducts(page, pageSize),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}