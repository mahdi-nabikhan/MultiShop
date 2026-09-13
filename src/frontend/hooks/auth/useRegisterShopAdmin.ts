import { useMutation } from "@tanstack/react-query";

import { registerShopAdmin } from "@/services/auth.services";
import type { RegisterShopAdminPayload } from "@/types/auth";

export default function useRegisterShopAdmin() {
    return useMutation({
        mutationFn: (data: RegisterShopAdminPayload) =>
            registerShopAdmin(data),
    });
}