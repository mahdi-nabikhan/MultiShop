import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getCommentDetail } from "@/services/cutomer-panel.services";

import { Comment } from "@/types/comment";

export default function useCustomerComment(commentId: number) {
    return useQuery<Comment>({
        queryKey: customerQueryKeys.comment(commentId),
        queryFn: () => getCommentDetail(commentId),
        enabled: !!commentId,
    });
}