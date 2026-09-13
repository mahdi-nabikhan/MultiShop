import { useQuery } from "@tanstack/react-query";

import { authQueryKeys } from "@/Lib/query-keys/auth.key";
import { getCurrentUser } from "@/services/auth.services";

export default function useCheckMe() {
    return useQuery({
        queryKey: authQueryKeys.me(),
        queryFn: getCurrentUser,
        retry: false,
    });
}