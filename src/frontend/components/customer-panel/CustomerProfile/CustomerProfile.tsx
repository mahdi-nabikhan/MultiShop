
"use client";

import { useEffect, useState } from "react";

import ChangePasswordModal from "@/components/auth/ChangePasswordModal/ChangePasswordModal";

import useCustomerProfile from "@/hooks/customer/useCustomerProfile";

import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import CustomerProfileInfo from "./CustomerProfileInfo";
import CustomerSecurity from "./CustomerSecurity";

import "./CustomerProfile.css";

export default function CustomerProfile() {
    // ==========================================
    // Profile Hook
    // ==========================================

    const {
        profile,
        isLoading,
        isError,
        refetch,
        updateProfile,
        isUpdating,
    } = useCustomerProfile();

    // ==========================================
    // Profile State
    // ==========================================

    const [editData, setEditData] = useState({
        username: "",
    });

    const [editing, setEditing] =
        useState(false);

    // ==========================================
    // Password Modal
    // ==========================================

    const [passwordModal, setPasswordModal] =
        useState(false);

    // ==========================================
    // Sync Profile With Form
    // ==========================================

    useEffect(() => {
        if (profile) {
            setEditData({
                username: profile.username,
            });
        }
    }, [profile]);

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

    // ==========================================
    // Update Profile
    // ==========================================

    function handleUpdateProfile(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        updateProfile(editData, {
            onSuccess: (data) => {
                setEditData({
                    username: data.username,
                });

                setEditing(false);
            },
        });
    }

    // ==========================================
    // Cancel Editing
    // ==========================================

    function handleCancelEdit() {
        setEditing(false);

        if (profile) {
            setEditData({
                username: profile.username,
            });
        }
    }

    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {
        return (
            <div className="customer-profile-loading">
                <Skeleton count={4} />
            </div>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (isError && !profile) {
        return (
            <div className="customer-profile-error">

                <ErrorState
                    message="Failed to load profile."
                />

                <button
                    type="button"
                    onClick={() => refetch()}
                >
                    Try Again
                </button>

            </div>
        );
    }

    // ==========================================
    // Profile Not Found
    // ==========================================

    if (!profile) {
        return (
            <div className="customer-profile-error">
                <EmptyState
                    message="Profile not found."
                />
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="customer-profile-container">

            <CustomerProfileInfo
                profile={profile}
                editing={editing}
                editData={editData}
                isUpdating={isUpdating}
                isError={isError}
                onEdit={() => setEditing(true)}
                onChange={handleProfileChange}
                onSubmit={handleUpdateProfile}
                onCancel={handleCancelEdit}
            />

            <CustomerSecurity
                onChangePassword={() =>
                    setPasswordModal(true)
                }
            />

            <ChangePasswordModal
                isOpen={passwordModal}
                onClose={() =>
                    setPasswordModal(false)
                }
            />

        </div>
    );
}
