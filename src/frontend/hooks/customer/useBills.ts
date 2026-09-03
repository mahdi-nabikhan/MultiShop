import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import { getBills } from "@/services/order.services";

export default function useBills(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: customerQueryKeys.bills(page, pageSize),

        queryFn: () => getBills(page, pageSize),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}