import { useQuery } from "@tanstack/react-query";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getBills } from "@/services/order.services";

export default function useBills() {
    return useQuery({
        queryKey: customerQueryKeys.bills(),
        queryFn: getBills,
    });
}