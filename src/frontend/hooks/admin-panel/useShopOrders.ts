"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getShopOrders } from "@/services/shop-admin-panel.services";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

export default function useShopOrders(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.orders(
            page,
            pageSize
        ),

        queryFn: () =>
            getShopOrders(
                page,
                pageSize
            ),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}