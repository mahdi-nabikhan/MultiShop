"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getCustomerOrders } from "@/services/order.services";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerOrders(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: customerQueryKeys.orders(
            page,
            pageSize
        ),

        queryFn: () =>
            getCustomerOrders(
                page,
                pageSize
            ),

        placeholderData: keepPreviousData,

        staleTime: 10 * 60 * 1000,

        gcTime: 30 * 60 * 1000,
    });
}