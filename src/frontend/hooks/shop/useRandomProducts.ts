
import { useQuery } from "@tanstack/react-query";

import { getRandomProducts } from "@/services/product.services";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";

import type { Product } from "@/types/product";


export default function useRandomProducts() {

    return useQuery<Product[]>({

        queryKey:
            shopQueryKeys.randomProducts(),

        queryFn:
            getRandomProducts,

        staleTime:
            5 * 60 * 1000,

        gcTime:
            15 * 60 * 1000,

    });

}
