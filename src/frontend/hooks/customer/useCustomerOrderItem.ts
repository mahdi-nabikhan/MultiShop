import { useQuery } from "@tanstack/react-query";

import { getCustomerOrderItemDetail } from "@/services/order.services";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import type { CustomerOrderItem } from "@/types/order";

export default function useCustomerOrderItem(itemId: number) {
    return useQuery<CustomerOrderItem>({
        queryKey: customerQueryKeys.orderItem(itemId),

        queryFn: () =>
            getCustomerOrderItemDetail(itemId),

        enabled: !!itemId,

        staleTime: 10 * 60 * 1000,

        gcTime: 30 * 60 * 1000,
    });
}