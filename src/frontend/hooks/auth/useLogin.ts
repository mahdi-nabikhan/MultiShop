import { useMutation } from "@tanstack/react-query";

import { login } from "@/services/auth.services";
import type { LoginRequest,LoginResponse } from "@/types/auth";

export default function useLogin() {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: login,
    });
}