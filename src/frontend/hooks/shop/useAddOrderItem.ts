
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addOrderItem } from "@/services/order.services";

interface AddOrderItemVariables {
    productId: number | string;
    quantity: number;
}

export default function useAddOrderItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            quantity,
        }: AddOrderItemVariables) =>
            addOrderItem(productId, quantity),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["order-items"],
            });

            queryClient.invalidateQueries({
                queryKey: ["session-cart"],
            });
        },
    });
}

