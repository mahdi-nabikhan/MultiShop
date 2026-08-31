import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getAddressDetail } from "@/services/cutomer-panel.services";

export default function useAddress(addressId: number) {
    return useQuery({
        queryKey: customerQueryKeys.address(addressId),
        queryFn: () => getAddressDetail(addressId),
        enabled: !!addressId,
    });
}