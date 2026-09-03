export const shopAdminQueryKeys = {
    products: () =>
        ["shop-admin", "products"] as const,

    product: (productId: number) =>
        ["shop-admin", "product", productId] as const,

    productDiscounts: (
        productId: number,
        page: number,
        pageSize: number
    ) =>
        [
            "shop-admin",
            "product-discounts",
            productId,
            page,
            pageSize,
        ] as const,

    productImages: (productId: number) =>
        ["shop-admin", "product-images", productId] as const,

    conversationMessages: (conversationId: number) =>
        ["shop-admin", "conversation-messages", conversationId] as const,

    conversations: () =>
        ["shop-admin", "conversations"] as const,

    admin: (adminId: number | string) =>
        ["shop-admin", "admin", adminId] as const,
    admins: (
        page: number,
        pageSize: number
    ) =>
        [
            "shop-admin",
            "admins",
            page,
            pageSize,
        ] as const,

    operator: (operatorId: number | string) =>
        ["shop-admin", "operator", operatorId] as const,

    operators: (
        page: number,
        pageSize: number
    ) =>
        [
            "shop-admin",
            "operators",
            page,
            pageSize,
        ] as const,



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