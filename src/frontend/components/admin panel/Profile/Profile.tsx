"use client";

import ChangePasswordModal from "@/components/auth/ChangePasswordModal/ChangePasswordModal";

import { useState } from "react";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getUserRole,
    getProfile,
    updateProfile,
} from "@/services/shop-admin-panel.services";

import ProfileForm from "./ProfileForm";

import "./Profile.css";


type Role = "manager" | "admin" | "operator";


export default function Profile() {

    const queryClient = useQueryClient();

    const [editMode, setEditMode] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Get User Role
    |--------------------------------------------------------------------------
    */

    const roleQuery = useQuery<Role>({
        queryKey: ["user-role"],
        queryFn: getUserRole,
    });


    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */

    const profileQuery = useQuery({

        queryKey: [
            "profile",
            roleQuery.data,
        ],

        enabled: !!roleQuery.data,

        queryFn: () =>
            getProfile(roleQuery.data!),

    });


    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    const updateMutation = useMutation({

        mutationFn: (data: any) =>
            updateProfile(
                roleQuery.data!,
                data
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: [
                    "profile",
                    roleQuery.data,
                ],

            });

            setEditMode(false);

        },

        onError: (error) => {

            console.error(
                "Failed to update profile:",
                error
            );

        },

    });


    /*
    |--------------------------------------------------------------------------
    | Loading States
    |--------------------------------------------------------------------------
    */

    if (roleQuery.isPending) {

        return (

            <div className="profile-container">

                <div className="profile-card">

                    <p>
                        Loading role...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Role Error
    |--------------------------------------------------------------------------
    */

    if (roleQuery.isError) {

        return (

            <div className="profile-container">

                <div className="profile-card">

                    <p>
                        Failed to load role.
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Profile Loading
    |--------------------------------------------------------------------------
    */

    if (profileQuery.isPending) {

        return (

            <div className="profile-container">

                <div className="profile-card">

                    <p>
                        Loading profile...
                    </p>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Profile Error
    |--------------------------------------------------------------------------
    */

    if (profileQuery.isError) {

        return (

            <div className="profile-container">

                <div className="profile-card">

                    <p>
                        Failed to load profile.
                    </p>

                </div>

            </div>

        );

    }


    const profile = profileQuery.data;


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="profile-container">


            {
                !editMode && (

                    <div className="profile-card">


                        <h2>
                            Profile Information
                        </h2>


                        <div className="profile-row">

                            <span>
                                First Name
                            </span>

                            <strong>
                                {
                                    profile.first_name || "-"
                                }
                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                Last Name
                            </span>

                            <strong>
                                {
                                    profile.last_name || "-"
                                }
                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                Email
                            </span>

                            <strong>

                                {
                                    profile.user?.email || "-"
                                }

                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                Store
                            </span>

                            <strong>

                                {
                                    profile.store?.name || "-"
                                }

                            </strong>

                        </div>


                        <button
                            className="edit-profile-btn"
                            onClick={() =>
                                setEditMode(true)
                            }
                        >

                            Edit Profile

                        </button>


                        <button
                            className="change-password-btn"
                            onClick={() =>
                                setPasswordModal(true)
                            }
                        >

                            Change Password

                        </button>


                    </div>

                )
            }


            {
                editMode && (

                    <div className="profile-edit-box">


                        <button
                            className="back-profile-btn"
                            onClick={() =>
                                setEditMode(false)
                            }
                        >

                            Back

                        </button>


                        <ProfileForm

                            data={profile}

                            loading={
                                updateMutation.isPending
                            }

                            onSubmit={(values) => {

                                updateMutation.mutate(
                                    values
                                );

                            }}

                        />


                    </div>

                )
            }


            <ChangePasswordModal

                isOpen={passwordModal}

                onClose={() =>
                    setPasswordModal(false)
                }

            />


        </div>

    );

}