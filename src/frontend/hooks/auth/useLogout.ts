import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/services/auth.services";
import { authQueryKeys } from "@/Lib/query-keys/auth.key";

export default function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: authQueryKeys.me(),
            });
        },
    });
}