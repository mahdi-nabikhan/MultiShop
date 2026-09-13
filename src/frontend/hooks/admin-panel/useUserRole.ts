import { useQuery } from "@tanstack/react-query";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys"; 
import { getUserRole } from "@/services/shop-admin-panel.services"; 

export default function useUserRole() {
    return useQuery({
        queryKey: shopAdminQueryKeys.userRole(),
        queryFn: getUserRole,
        retry: false,
    });
}