
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

import ChangePasswordModal from "@/components/auth/ChangePasswordModal/ChangePasswordModal";

import "./CustomerProfile.css";


interface CustomerProfile {

    id: number;

    username: string;

    is_customer: boolean;

    user: number;

}


export default function CustomerProfile() {


    // ==========================================
    // Profile
    // ==========================================

    const [profile, setProfile] =
        useState<CustomerProfile | null>(null);


    const [editData, setEditData] =
        useState({
            username: "",
        });


    const [editing, setEditing] =
        useState(false);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");



    // ==========================================
    // Password Modal
    // ==========================================

    const [passwordModal, setPasswordModal] =
        useState(false);



    // ==========================================
    // Get Customer Profile
    // ==========================================

    async function getProfile() {

        try {

            setLoading(true);

            setError("");


            const response =
                await axios.get<CustomerProfile>(

                    `${BACKEND_URLS}customer/api/v1/customer/detail/`,

                    {
                        withCredentials: true,
                    }

                );


            setProfile(response.data);


            setEditData({

                username:
                    response.data.username,

            });


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );


            setError(
                "Failed to load your profile."
            );


        } finally {

            setLoading(false);

        }

    }



    // ==========================================
    // Load Profile
    // ==========================================

    useEffect(() => {

        getProfile();

    }, []);



    // ==========================================
    // Profile Input
    // ==========================================

    function handleProfileChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setEditData({

            ...editData,

            [e.target.name]:
                e.target.value,

        });

    }



    // ==========================================
    // Update Profile
    // ==========================================

    async function updateProfile(
        e: React.FormEvent
    ) {

        e.preventDefault();


        try {

            setSaving(true);

            setError("");


            const response =
                await axios.put<CustomerProfile>(

                    `${BACKEND_URLS}customer/api/v1/customer/detail/`,

                    editData,

                    {
                        withCredentials: true,
                    }

                );


            setProfile(response.data);


            setEditData({

                username:
                    response.data.username,

            });


            setEditing(false);


        } catch (error: any) {

            console.error(
                "Profile update error:",
                error
            );


            if (error.response?.data) {

                setError(
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                setError(
                    "Failed to update your profile."
                );

            }


        } finally {

            setSaving(false);

        }

    }



    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="customer-profile-loading">

                Loading profile...

            </div>

        );

    }



    // ==========================================
    // Error
    // ==========================================

    if (error && !profile) {

        return (

            <div className="customer-profile-error">

                <p>
                    {error}
                </p>


                <button
                    onClick={getProfile}
                >

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

                                value={
                                    editData.username
                                }

                                onChange={
                                    handleProfileChange
                                }

                                required

                            />

                        </div>



                        {error && (

                            <p className="form-error">

                                {error}

                            </p>

                        )}



                        <div className="profile-form-actions">


                            <button

                                type="button"

                                className="cancel-btn"

                                onClick={() => {

                                    setEditing(false);

                                    setError("");

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

                                disabled={saving}

                            >

                                {saving
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
