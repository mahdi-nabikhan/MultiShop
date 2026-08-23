export const chatQueryKeys = {
    conversationMessages: (conversationId: number) =>
        ["chat", "conversation-messages", conversationId] as const,

    conversations: () =>
        ["chat", "conversations"] as const,
};