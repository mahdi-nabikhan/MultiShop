"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductDiscounts } from "@/services/shop-admin-panel.services";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";


export default function useProductDiscounts(
    productId: number
) {

    return useQuery({

        queryKey:
            shopAdminQueryKeys.productDiscounts(
                productId
            ),

        queryFn: () =>
            getProductDiscounts(productId),

        enabled: !!productId,

    });

}