import { useQuery } from "@tanstack/react-query";

import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";
import { getConversationMessages } from "@/services/chat.services";

import { Message } from "@/types/chat";

export default function useConversationMessages(
    conversationId: number | null
) {
    return useQuery<Message[]>({
        queryKey: chatQueryKeys.conversationMessages(
            conversationId as number
        ),

        queryFn: () =>
            getConversationMessages(
                conversationId as number
            ),

        enabled: conversationId !== null,

        refetchInterval: 3000,
    });
}