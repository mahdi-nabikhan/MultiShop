"use client";

import { useEffect, useState } from "react";

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

import ChangePasswordModal from "@/components/auth/ChangePasswordModal/ChangePasswordModal";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import "./CustomerProfile.css";


export default function CustomerProfile() {

    // ==========================================
    // Profile
    // ==========================================

    const [editData, setEditData] = useState({
        username: "",
    });

    const [editing, setEditing] = useState(false);


    // ==========================================
    // Password Modal
    // ==========================================

    const [passwordModal, setPasswordModal] =
        useState(false);


    // ==========================================
    // Query Client
    // ==========================================

    const queryClient = useQueryClient();


    // ==========================================
    // Get Customer Profile
    // ==========================================

    const {
        data: profile,
        isLoading,
        isError,
        refetch,
    } = useQuery<CustomerProfileProp>({
        queryKey: customerQueryKeys.profile(),
        queryFn: getCustomerProfile,
    });


    // ==========================================
    // Profile Input
    // ==========================================

    function handleProfileChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });

    }


    useEffect(() => {

        if (profile) {

            setEditData({
                username: profile.username,
            });

        }

    }, [profile]);


    // ==========================================
    // Update Profile
    // ==========================================

    const updateProfileMutation = useMutation({

        mutationFn: updateCustomerProfile,

        onSuccess: (data) => {

            queryClient.setQueryData(
                customerQueryKeys.profile(),
                data
            );

            setEditData({
                username: data.username,
            });

            setEditing(false);

        },

        onError: (error: any) => {

            console.error(
                "Profile update error:",
                error
            );

        },

    });


    function updateProfile(
        e: React.FormEvent
    ) {

        e.preventDefault();

        updateProfileMutation.mutate(
            editData
        );

    }


    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {

        return (

            <div className="customer-profile-loading">

                Loading profile...

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError && !profile) {

        return (

            <div className="customer-profile-error">

                <p>
                    Failed to load profile.
                </p>

                <button onClick={() => refetch()}>
                    Try Again
                </button>

            </div>

        );

    }


    if (!profile) {

        return null;

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="customer-profile-container">


            {/* ==================================
                PROFILE CARD
            ================================== */}

            <section className="customer-profile-card">


                <div className="customer-profile-header">


                    <div>

                        <span className="profile-label">
                            ACCOUNT
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your account
                            information.
                        </p>

                    </div>


                    {!editing && (

                        <button
                            type="button"
                            className="edit-profile-btn"
                            onClick={() =>
                                setEditing(true)
                            }
                        >

                            Edit Profile

                        </button>

                    )}


                </div>


                {!editing ? (

                    <div className="customer-profile-info">


                        {/* Username */}

                        <div className="profile-info-row">

                            <div className="profile-info-label">
                                Username
                            </div>

                            <div className="profile-info-value">
                                {profile.username}
                            </div>

                        </div>


                        {/* Customer ID */}

                        <div className="profile-info-row">

                            <div className="profile-info-label">
                                Customer ID
                            </div>

                            <div className="profile-info-value">
                                #{profile.id}
                            </div>

                        </div>


                        {/* Account Type */}

                        <div className="profile-info-row">

                            <div className="profile-info-label">
                                Account Type
                            </div>

                            <div className="profile-info-value">

                                <span className="customer-badge">
                                    Customer
                                </span>

                            </div>

                        </div>


                        {/* Status */}

                        <div className="profile-info-row">

                            <div className="profile-info-label">
                                Status
                            </div>

                            <div className="profile-info-value">

                                <span className="active-badge">
                                    Active
                                </span>

                            </div>

                        </div>


                    </div>

                ) : (

                    /* ==================================
                       EDIT FORM
                    ================================== */

                    <form
                        onSubmit={updateProfile}
                        className="customer-profile-form"
                    >


                        <div className="form-group">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={editData.username}
                                onChange={
                                    handleProfileChange
                                }
                                required
                            />

                        </div>


                        {isError && (

                            <p className="form-error">
                                Failed to update profile.
                            </p>

                        )}


                        <div className="profile-form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {

                                    setEditing(false);

                                    setEditData({
                                        username:
                                            profile.username,
                                    });

                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-profile-btn"
                                disabled={
                                    updateProfileMutation.isPending
                                }
                            >

                                {updateProfileMutation.isPending
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                            </button>

                        </div>


                    </form>

                )}


            </section>


            {/* ==================================
                SECURITY CARD
            ================================== */}

            <section className="customer-security-card">


                <div className="security-header">


                    <div>

                        <span className="profile-label">
                            SECURITY
                        </span>

                        <h2>
                            Password & Security
                        </h2>

                        <p>
                            Manage your account password.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="change-password-btn"
                        onClick={() =>
                            setPasswordModal(true)
                        }
                    >

                        Change Password

                    </button>


                </div>


            </section>


            <ChangePasswordModal
                isOpen={passwordModal}
                onClose={() =>
                    setPasswordModal(false)
                }
            />


        </div>

    );

}