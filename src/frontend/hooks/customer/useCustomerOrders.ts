"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerOrders } from "@/services/order.services";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerOrders() {
    return useQuery({
        queryKey: customerQueryKeys.orders(),
        queryFn: getCustomerOrders,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}