import { useQuery } from "@tanstack/react-query";

import { shopQueryKeys } from "@/Lib/query-keys/shop.keys";
import {
    getStoreCategories,
    type StoreCategory,
} from "@/services/shop.services";

export default function useStoreCategories() {
    return useQuery<StoreCategory[]>({
        queryKey: shopQueryKeys.storeCategories(),
        queryFn: getStoreCategories,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });
}