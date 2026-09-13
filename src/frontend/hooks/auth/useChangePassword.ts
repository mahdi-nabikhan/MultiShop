import { useMutation } from "@tanstack/react-query";

import { changePassword } from "@/services/auth.services";
import type { ChangePasswordData } from "@/types/auth";

export default function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordData) => changePassword(data),
    });
}