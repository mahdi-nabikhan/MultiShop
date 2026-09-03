import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { getShopTickets } from "@/services/shop-admin-panel.services";

export default function useShopTickets(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.tickets(page, pageSize),

        queryFn: () => getShopTickets(page, pageSize),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}