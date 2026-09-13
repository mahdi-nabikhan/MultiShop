import { useMutation } from "@tanstack/react-query";

import { register } from "@/services/auth.services";
import type { RegisterRequest } from "@/types/auth";

export default function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),
    });
}