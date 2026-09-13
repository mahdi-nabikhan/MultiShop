
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/services/auth.services";

export default function useCheckMe() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getCurrentUser,
        retry: false,
    });
}

