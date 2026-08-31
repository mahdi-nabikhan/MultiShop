"use client";

import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateShopAdmin,
    getShopAdmin,
    deleteShopAdmin,
} from "@/services/shop-admin-panel.services";

import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

import { AdminDetailProp } from "@/types/panel-admin";

import { useRouter } from "next/navigation";

import DeleteModal from "../DeleteModal/DeleteModal";
import UpdateAdminModal from "../UpdateAdminModal/UpdateAdminModal";

import "./AdminDetail.css";


interface Props {

    adminId: number | string;

}


export default function AdminDetail({
    adminId,
}: Props) {


    const [showDelete, setShowDelete] =
        useState(false);

    const [showUpdate, setShowUpdate] =
        useState(false);


    const router = useRouter();

    const queryClient =
        useQueryClient();


    // ==========================================
    // Get Admin
    // ==========================================

    const {
        data: admin,
        isLoading: loading,
        isError,
    } = useQuery<AdminDetailProp>({

        queryKey:
            shopAdminQueryKeys.admin(adminId),

        queryFn: () =>
            getShopAdmin(adminId),

        enabled: !!adminId,

    });


    // ==========================================
    // Delete Admin
    // ==========================================

    const deleteAdminMutation =
        useMutation({

            mutationFn: () =>
                deleteShopAdmin(adminId),

            onSuccess: () => {

                queryClient.invalidateQueries({

                    queryKey:
                        shopAdminQueryKeys.admins(),

                });

                router.push(
                    "/shop-admin-panel/admin"
                );

            },

            onError: (error) => {

                console.error(
                    "DELETE ADMIN ERROR:",
                    error
                );

            },

        });


    // ==========================================
    // Update Admin
    // ==========================================

    const updateAdminMutation =
        useMutation({

            mutationFn: (
                username: string
            ) =>
                updateShopAdmin(
                    adminId,
                    username
                ),

            onSuccess: (_, username) => {

                queryClient.setQueryData<AdminDetailProp>(

                    shopAdminQueryKeys.admin(
                        adminId
                    ),

                    (previous) => {

                        if (!previous) {

                            return previous;

                        }

                        return {

                            ...previous,

                            username,

                        };

                    }

                );


                // Update admin list cache

                queryClient.invalidateQueries({

                    queryKey:
                        shopAdminQueryKeys.admins(),

                });


                setShowUpdate(false);

            },

            onError: (error) => {

                console.error(
                    "UPDATE ADMIN ERROR:",
                    error
                );

            },

        });


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError || !admin) {

        return (
            <h2>
                Admin Not Found
            </h2>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="admin-detail-page">


            <div className="admin-detail-card">


                <div className="admin-avatar">

                    {
                        admin.user.email
                            .charAt(0)
                            .toUpperCase()
                    }

                </div>


                <h1>

                    {
                        admin.username ||
                        "No Username"
                    }

                </h1>


                <span className="role-badge">

                    Administrator

                </span>


                <div className="detail-grid">


                    <div>

                        <span>
                            Email
                        </span>

                        <strong>

                            {
                                admin.user.email
                            }

                        </strong>

                    </div>


                    <div>

                        <span>
                            Username
                        </span>

                        <strong>

                            {
                                admin.username ||
                                "-"
                            }

                        </strong>

                    </div>


                </div>


                <div className="button-group">


                    <button

                        className="update-btn"

                        onClick={() =>
                            setShowUpdate(true)
                        }

                    >

                        Update Admin

                    </button>


                    <button
                        className="password-btn"
                    >

                        Change Password

                    </button>


                    <button

                        className="delete-btn"

                        onClick={() =>
                            setShowDelete(true)
                        }

                    >

                        Delete Admin

                    </button>


                </div>


            </div>


            {/* ==================================
                DELETE MODAL
            ================================== */}

            <DeleteModal

                open={showDelete}

                loading={
                    deleteAdminMutation.isPending
                }

                title="Delete Admin"

                message={
                    "Are you sure you want to delete this admin?"
                }

                onClose={() =>
                    setShowDelete(false)
                }

                onConfirm={() =>
                    deleteAdminMutation.mutate()
                }

            />


            {/* ==================================
                UPDATE MODAL
            ================================== */}

            <UpdateAdminModal

                open={showUpdate}

                loading={
                    updateAdminMutation.isPending
                }

                username={
                    admin.username
                }

                onClose={() =>
                    setShowUpdate(false)
                }

                onConfirm={(username) =>
                    updateAdminMutation.mutate(
                        username
                    )
                }

            />


        </div>

    );

}