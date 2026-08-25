export const customerQueryKeys = {

    // =========================
    // Comments
    // =========================

    comments: () =>
        ["customer", "comments"] as const,


    // =========================
    // Addresses
    // =========================

    addresses: () =>
        ["customer", "addresses"] as const,

    address: (addressId: number | string) =>
        ["customer", "address", addressId] as const,


    // =========================
    // Conversations
    // =========================

    conversations: () =>
        ["customer", "conversations"] as const,

    conversationMessages: (conversationId: number | string) =>
        ["customer", "conversation-messages", conversationId] as const,


    // =========================
    // Profile
    // =========================

    profile: () =>
        ["customer", "profile"] as const,


    // =========================
    // Orders
    // =========================

    orders: () =>
        ["customer", "orders"] as const,

    orderItems: (orderId: number | string) =>
        ["customer", "order-items", orderId] as const,

    orderItem: (orderItemId: number | string) =>
        ["customer", "order-item", orderItemId] as const,


    // =========================
    // Tickets
    // =========================

    tickets: () =>
        ["customer", "tickets"] as const,

    ticket: (ticketId: number | string) =>
        ["customer", "ticket", ticketId] as const,

    ticketReplies: (ticketId: number | string) =>
        ["customer", "ticket-replies", ticketId] as const,


    // =========================
    // Bills
    // =========================

    bills: () =>
        ["customer", "bills"] as const,

};