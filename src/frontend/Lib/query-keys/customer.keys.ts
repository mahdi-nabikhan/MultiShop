export const customerQueryKeys = {

    // =========================
    // Comments
    // =========================
    comments: (
        page: number,
        pageSize: number
    ) => [
        "customer",
        "comments",
        page,
        pageSize,
    ] as const,
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
    orders: (
        page: number,
        pageSize: number
    ) => [
        "customer",
        "orders",
        page,
        pageSize,
    ] as const,
    orderItems: (
        orderId: number | string,
        page: number,
        pageSize: number
    ) => [
        "customer",
        "order-items",
        orderId,
        page,
        pageSize,
    ] as const,

    orderItem: (orderItemId: number | string) =>
        ["customer", "order-item", orderItemId] as const,


    // =========================
    // Tickets
    // =========================

    tickets: (
        page: number,
        pageSize: number
    ) => [
        "customer",
        "tickets",
        page,
        pageSize,
    ] as const,
    ticket: (ticketId: number | string) =>
        ["customer", "ticket", ticketId] as const,

    ticketReplies: (ticketId: number | string) =>
        ["customer", "ticket-replies", ticketId] as const,


    // =========================
    // Bills
    // =========================

    bills: (
        page: number,
        pageSize: number
    ) => [
        "customer",
        "bills",
        page,
        pageSize,
    ] as const,

    comment: (commentId: number) =>
        ["customer", "comment", commentId] as const,
};