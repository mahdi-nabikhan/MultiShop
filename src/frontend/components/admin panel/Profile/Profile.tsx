"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BACKEND_URLS from "@/utils";
import { getProfile, updateProfile } from "./profileApi";
import type { UserRole } from "./profileConfig";

import ProfileForm from "./ProfileForm";

export default function Profile() {

    const queryClient = useQueryClient();

    // گرفتن Role
    const roleQuery = useQuery<UserRole>({
        queryKey: ["user-role"],
        queryFn: async () => {

            const response = await axios.get(
                `${BACKEND_URLS}account/api/v1/user-role/`,
                {
                    withCredentials: true,
                }
            );

            return response.data.role;
        },
    });

    // گرفتن پروفایل
    const profileQuery = useQuery({
        queryKey: ["profile", roleQuery.data],
        enabled: !!roleQuery.data,

        queryFn: () => getProfile(roleQuery.data!),
    });

    // بروزرسانی
    const updateMutation = useMutation({

        mutationFn: (data: any) =>
            updateProfile(roleQuery.data!, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile", roleQuery.data],
            });
        },
    });

    if (roleQuery.isPending)
        return <p>Loading role...</p>;

    if (profileQuery.isPending)
        return <p>Loading profile...</p>;

    if (roleQuery.isError)
        return <p>Failed to load role.</p>;

    if (profileQuery.isError)
        return <p>Failed to load profile.</p>;

    return (
        <ProfileForm
            data={profileQuery.data}
            loading={updateMutation.isPending}
            onSubmit={(values) => updateMutation.mutate(values)}
        />
    );
}