import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import { getCustomerComments } from "@/services/cutomer-panel.services";

export default function useCustomerComments(
    page: number,
    pageSize: number = 8
) {
    return useQuery({
        queryKey: customerQueryKeys.comments(page, pageSize),

        queryFn: () => getCustomerComments(page, pageSize),

        placeholderData: keepPreviousData,

        staleTime: 2 * 60 * 1000,

        gcTime: 10 * 60 * 1000,
    });
}