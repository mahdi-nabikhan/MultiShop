import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import { sendConversationMessage } from "@/services/shop-admin-panel.services";

interface SendMessageParams {
    conversationId: number;
    text: string;
}

export default function useSendConversationMessage() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            text,
        }: SendMessageParams) =>
            sendConversationMessage(
                conversationId,
                text
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey:
                    shopAdminQueryKeys.conversationMessages(
                        variables.conversationId
                    ),
            });
        },

        onError: (error) => {
            console.error(
                "SEND MESSAGE ERROR:",
                error
            );
        },
    });
}