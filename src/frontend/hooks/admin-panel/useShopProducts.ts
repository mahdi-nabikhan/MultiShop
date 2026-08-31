

import { useQuery } from "@tanstack/react-query";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { getShopProducts } from "@/services/shop-admin-panel.services";

export function useShopProducts() {
    return useQuery({
        queryKey: shopAdminQueryKeys.products(),
        queryFn: getShopProducts,
    });
}