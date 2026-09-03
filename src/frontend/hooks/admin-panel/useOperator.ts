"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getOperators } from "@/services/shop-admin-panel.services";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

export default function useOperators(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.operators(
            page,
            pageSize
        ),

        queryFn: () =>
            getOperators(
                page,
                pageSize
            ),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}