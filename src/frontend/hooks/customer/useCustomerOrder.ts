import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import { getCustomerOrderItems } from "@/services/order.services";

export function useCustomerOrderItems(
    orderId: number,
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: customerQueryKeys.orderItems(
            orderId,
            page,
            pageSize
        ),

        queryFn: () =>
            getCustomerOrderItems(
                orderId,
                page,
                pageSize
            ),

        enabled: !!orderId,

        placeholderData: keepPreviousData,

        staleTime: 10 * 60 * 1000,

        gcTime: 30 * 60 * 1000,
    });
}