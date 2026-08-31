
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAddress } from "@/services/cutomer-panel.services";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useDeleteAddress(addressId: number) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteAddress(addressId),

        onSuccess: async () => {

            await queryClient.invalidateQueries({
                queryKey: customerQueryKeys.addresses(),
            });

            await queryClient.invalidateQueries({
                queryKey: customerQueryKeys.address(addressId),
            });

        },

        onError: (error) => {

            console.error(
                "DELETE ADDRESS ERROR:",
                error
            );

        },
    });
}
