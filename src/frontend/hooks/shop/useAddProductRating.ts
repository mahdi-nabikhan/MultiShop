
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { addProductRating } from "@/services/product.services";
import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

interface AddProductRatingVariables {
    productId: number;
    rate: number;
}

export default function useAddProductRating() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            productId,
            rate,
        }: AddProductRatingVariables) =>
            addProductRating(
                productId,
                rate
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: shopQueryKeys.canRateProduct(
                    variables.productId
                ),
            });
        },
    });
}

