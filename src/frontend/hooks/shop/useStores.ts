
import { useQuery } from "@tanstack/react-query";

import { getStores } from "@/services/shop.services";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";


export default function useStores(page: string) {

    return useQuery({

        queryKey:
            shopQueryKeys.stores(page),

        queryFn: () =>
            getStores(page),

        staleTime:
            5 * 60 * 1000,

        gcTime:
            15 * 60 * 1000,

    });

}

