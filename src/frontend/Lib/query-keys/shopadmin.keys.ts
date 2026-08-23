export const shopAdminQueryKeys = {
    products: () =>
        ["shop-admin", "products"] as const,

    product: (productId: number) =>
        ["shop-admin", "product", productId] as const,

    productDiscounts: (productId: number) =>
        ["shop-admin", "product-discounts", productId] as const,

    productImages: (productId: number) =>
        ["shop-admin", "product-images", productId] as const,

    conversationMessages: (conversationId: number) =>
        ["shop-admin", "conversation-messages", conversationId] as const,

    conversations: () =>
        ["shop-admin", "conversations"] as const,

    admin: (adminId: number | string) =>
        ["shop-admin", "admin", adminId] as const,

    admins: () =>
        ["shop-admin", "admins"] as const,

    operator: (operatorId: number | string) =>
        ["shop-admin", "operator", operatorId] as const,

    orderItems: (orderId: number | string) =>
        ["shop-admin", "order-items", orderId] as const,

    orderItem: (orderItemId: number | string) =>
        ["shop-admin", "order-item", orderItemId] as const,

    orders: () =>
        ["shop-admin", "orders"] as const,

    userRole: () =>
        ["shop-admin", "user-role"] as const,

    profile: (role: string) =>
        ["shop-admin", "profile", role] as const,

    tickets: () =>
        ["shop-admin", "tickets"] as const,

    storeProfile: () =>
    ["shop-admin", "store-profile"] as const,
    
    ticketReplies: (ticketId: number) =>
    ["shop-admin", "ticket-replies", ticketId] as const,
};