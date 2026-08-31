
"use client";

import { useQuery } from "@tanstack/react-query";

import { getCustomerTickets } from "@/services/cutomer-panel.services";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerTickets() {
    return useQuery({
        queryKey: customerQueryKeys.tickets(),
        queryFn: getCustomerTickets,
    });
}

