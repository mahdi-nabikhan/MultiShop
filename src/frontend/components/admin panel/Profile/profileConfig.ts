export const profileConfig = {
    manager: {
        endpoint: "manager/detail/",
        title: "Manager",
    },

    admin: {
        endpoint: "admin/detail/",
        title: "Admin",
    },

    operator: {
        endpoint: "operator/detail/",
        title: "Operator",
    },
} as const;

export type UserRole = keyof typeof profileConfig;