import { useMutation } from "@tanstack/react-query";

import { registerManager } from "@/services/auth.services";
import type { RegisterManagerData } from "@/types/auth";

export default function useRegisterManager() {
    return useMutation<void, Error, RegisterManagerData>({
        mutationFn: registerManager,
    });
}