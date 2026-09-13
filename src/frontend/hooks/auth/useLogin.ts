import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/services/auth.services";
import { authQueryKeys } from "@/Lib/query-keys/auth.key"; 
import type {
    LoginRequest,
    LoginResponse,
} from "@/types/auth";

export default function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: login,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: authQueryKeys.me(),
            });
        },
    });
}