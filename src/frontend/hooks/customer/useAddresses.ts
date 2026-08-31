import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getAddresses } from "@/services/cutomer-panel.services";

export default function useAddresses() {
    return useQuery({
        queryKey: customerQueryKeys.addresses(),
        queryFn: getAddresses,
    });
}