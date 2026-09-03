"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getAdmins } from "@/services/shop-admin-panel.services";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

export default function useAdmins(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: shopAdminQueryKeys.admins(
            page,
            pageSize
        ),

        queryFn: () =>
            getAdmins(
                page,
                pageSize
            ),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}