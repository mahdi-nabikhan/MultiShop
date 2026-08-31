// hooks/chat/useChat.ts

import { useEffect, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";

import {
    createConversation,
    getConversationMessages,
    sendConversationMessage,
} from "@/services/chat.services";

import { MessageProp } from "@/types/chat";

export default function useChat(storeId: number) {
    const [conversationId, setConversationId] =
        useState<number | null>(null);

    const queryClient = useQueryClient();

    // Create conversation
    const createConversationMutation = useMutation({
        mutationFn: createConversation,

        onSuccess: (data) => {
            setConversationId(data.conversation_id);
        },
    });

    // Get messages
    const {
        data: messages = [],
        isLoading: isMessagesLoading,
        isError: isMessagesError,
    } = useQuery<MessageProp[]>({
        queryKey:
            conversationId !== null
                ? chatQueryKeys.conversationMessages(conversationId)
                : ["conversation-messages", "disabled"],

        queryFn: () =>
            getConversationMessages(conversationId as number),

        enabled: conversationId !== null,

        refetchInterval: 3000,

        staleTime: 0,

        gcTime: 10 * 60 * 1000,
    });

    // Send message
    const sendMessageMutation = useMutation({
        mutationFn: ({
            conversationId,
            text,
        }: {
            conversationId: number;
            text: string;
        }) =>
            sendConversationMessage(
                conversationId,
                text
            ),

        onSuccess: () => {
            if (conversationId === null) {
                return;
            }

            queryClient.invalidateQueries({
                queryKey:
                    chatQueryKeys.conversationMessages(
                        conversationId
                    ),
            });
        },
    });

    // Create conversation when store changes
    useEffect(() => {
        setConversationId(null);

        createConversationMutation.mutate(storeId);
    }, [storeId]);

    return {
        conversationId,

        messages,

        isLoading:
            createConversationMutation.isPending ||
            isMessagesLoading,

        isError:
            createConversationMutation.isError ||
            isMessagesError,

        sendMessage: (text: string) => {
            if (conversationId === null) {
                return;
            }

            sendMessageMutation.mutate({
                conversationId,
                text,
            });
        },

        isSending: sendMessageMutation.isPending,
    };
}