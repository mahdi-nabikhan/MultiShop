import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createProduct } from "@/services/shop-admin-panel.services";

export default function useCreateProduct() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (
            formData: FormData
        ) =>
            createProduct(formData),


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [
                    "shop-admin",
                    "products",
                ],
            });

        },


        onError: (error) => {

            console.error(
                "Create product error:",
                error
            );

        },

    });

}