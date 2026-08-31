import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys"; 
import { getCustomerOrderItems } from "@/services/order.services";

export function useCustomerOrderItems(orderId: number) {
    return useQuery({
        queryKey: customerQueryKeys.orderItems(orderId),
        queryFn: () => getCustomerOrderItems(orderId),
        enabled: !!orderId,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}