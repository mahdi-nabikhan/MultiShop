import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getCustomerComments } from "@/services/cutomer-panel.services";

import { Comment } from "@/types/comment";

export default function useCustomerComments() {
    return useQuery<Comment[]>({
        queryKey: customerQueryKeys.comments(),
        queryFn: getCustomerComments,
    });
}