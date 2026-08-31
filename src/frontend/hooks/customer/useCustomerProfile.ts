"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getCustomerProfile,
    updateCustomerProfile,
} from "@/services/cutomer-panel.services";

import { CustomerProfileProp } from "@/types/customer";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

export default function useCustomerProfile() {

    const queryClient = useQueryClient();

    const profileQuery = useQuery<CustomerProfileProp>({
        queryKey: customerQueryKeys.profile(),
        queryFn: getCustomerProfile,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateCustomerProfile,

        onSuccess: (data) => {

            queryClient.setQueryData(
                customerQueryKeys.profile(),
                data
            );

        },
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        refetch: profileQuery.refetch,

        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
        updateError: updateProfileMutation.error,
    };
}