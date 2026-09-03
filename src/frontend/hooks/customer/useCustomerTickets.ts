"use client";

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { getCustomerTickets } from "@/services/cutomer-panel.services";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerTickets(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: customerQueryKeys.tickets(
            page,
            pageSize
        ),

        queryFn: () =>
            getCustomerTickets(
                page,
                pageSize
            ),

        placeholderData: keepPreviousData,
    });
}