import { useMutation } from "@tanstack/react-query";

import { createOperator } from "@/services/auth.services";
import type { CreateOperatorData } from "@/types/auth";

export default function useCreateOperator() {
    return useMutation({
        mutationFn: (data: CreateOperatorData) => createOperator(data),
    });
}