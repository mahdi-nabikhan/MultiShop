"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getProductDiscounts } from "@/services/shop-admin-panel.services";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

export default function useProductDiscounts(
    productId: number,
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.productDiscounts(
            productId,
            page,
            pageSize
        ),

        queryFn: () =>
            getProductDiscounts(
                productId,
                page,
                pageSize
            ),

        enabled: !!productId,

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}