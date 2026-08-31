import { useQuery } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { getConversationMessages } from "@/services/shop-admin-panel.services";

export default function useConversationMessages(
    conversationId: number | null
) {
    return useQuery({
        queryKey:
            shopAdminQueryKeys.conversationMessages(
                conversationId!
            ),

        queryFn: () =>
            getConversationMessages(
                conversationId!
            ),

        enabled: !!conversationId,

        refetchInterval: 3000,
    });
}