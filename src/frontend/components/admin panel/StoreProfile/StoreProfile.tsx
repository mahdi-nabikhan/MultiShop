"use client";

import { useEffect, useState } from "react";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getStoreProfile,
    updateStoreProfile,
} from "@/services/shop-admin-panel.services";

import "./StoreProfile.css";


interface StoreData {
    pk: number;
    image: string | null;
    description?: string;
    name?: string;
}


interface StoreFormData {
    name: string;
    description: string;
}


export default function StoreProfile() {

    const queryClient = useQueryClient();


    const [formData, setFormData] =
        useState<StoreFormData>({
            name: "",
            description: "",
        });


    const [editing, setEditing] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    /* =========================
       GET STORE
    ========================= */

    const {
        data: store,
        isPending: loading,
        isError,
    } = useQuery<StoreData>({
        queryKey: shopAdminQueryKeys.storeProfile(),
        queryFn: getStoreProfile,
    });


    /* =========================
       SET FORM DATA
    ========================= */

    useEffect(() => {

        if (!store) {
            return;
        }

        setFormData({

            name:
                store.name ?? "",

            description:
                store.description ?? "",

        });

    }, [store]);


    /* =========================
       UPDATE STORE
    ========================= */

    const updateMutation = useMutation({

        mutationFn: (
            data: StoreFormData
        ) =>
            updateStoreProfile(data),

        onSuccess: (updatedStore) => {

            queryClient.invalidateQueries({

                queryKey: [
                    "store-profile",
                ],

            });


            setFormData({

                name:
                    updatedStore.name ??
                    formData.name,

                description:
                    updatedStore.description ??
                    formData.description,

            });


            setEditing(false);


            setSuccess(
                "Store information updated successfully."
            );


            setError("");

        },

        onError: (error: any) => {

            console.error(
                "UPDATE STORE ERROR:",
                error
            );


            if (
                error.response?.data
            ) {

                const data =
                    error.response.data;


                if (
                    typeof data === "string"
                ) {

                    setError(data);

                } else if (
                    typeof data === "object"
                ) {

                    const messages =
                        Object.entries(data)
                            .map(
                                ([field, value]) =>
                                    `${field}: ${
                                        Array.isArray(value)
                                            ? value.join(", ")
                                            : value
                                    }`
                            )
                            .join(" | ");


                    setError(
                        messages ||
                        "Failed to update store."
                    );

                } else {

                    setError(
                        "Failed to update store."
                    );

                }

            } else {

                setError(
                    "Failed to update store."
                );

            }

        },

    });


    /* =========================
       HANDLE INPUT
    ========================= */

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (prev) => ({

                ...prev,

                [name]: value,

            })
        );

    }


    /* =========================
       HANDLE SUBMIT
    ========================= */

    function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();


        setError("");

        setSuccess("");


        updateMutation.mutate(
            formData
        );

    }


    /* =========================
       CANCEL EDIT
    ========================= */

    function handleCancel() {

        if (!store) {
            return;
        }


        setFormData({

            name:
                store.name ?? "",

            description:
                store.description ?? "",

        });


        setEditing(false);

        setError("");

        setSuccess("");

    }


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="store-profile-loading">

                <div className="store-profile-spinner" />

                <p>
                    Loading store...
                </p>

            </div>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (isError || !store) {

        return (

            <div className="store-profile-error">

                {error ||
                    "Store information not found."}

            </div>

        );

    }


    /* =========================
       STORE DATA
    ========================= */

    const storeName =
        store.name ??
        "Unnamed Store";


    const storeDescription =
        store.description ??
        "No description provided.";


    const storeInitial =
        storeName
            .charAt(0)
            .toUpperCase() ||
        "S";


    /* =========================
       RENDER
    ========================= */

    return (

        <section className="store-profile">


            {/* HEADER */}

            <div className="store-profile-header">

                <div>

                    <h2>
                        Store Information
                    </h2>

                    <p>
                        View and manage your store information.
                    </p>

                </div>


                {!editing && (

                    <button
                        type="button"
                        className="store-edit-button"
                        onClick={() => {

                            setEditing(true);

                            setSuccess("");

                            setError("");

                        }}
                    >

                        Edit Store

                    </button>

                )}

            </div>


            {/* STORE IMAGE */}

            <div className="store-image-section">

                <div className="store-image">

                    {store.image ? (

                        <img
                            src={store.image}
                            alt={storeName}
                        />

                    ) : (

                        <span>
                            {storeInitial}
                        </span>

                    )}

                </div>


                <div>

                    <h3>
                        {storeName}
                    </h3>

                    <span>
                        Store ID: #{store.pk}
                    </span>

                </div>

            </div>


            {/* FORM */}

            <form
                className="store-profile-form"
                onSubmit={handleSubmit}
            >


                {/* NAME */}

                <div className="store-form-group">

                    <label htmlFor="store-name">
                        Store Name
                    </label>


                    {editing ? (

                        <input
                            id="store-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    ) : (

                        <div className="store-value">

                            {storeName}

                        </div>

                    )}

                </div>


                {/* DESCRIPTION */}

                <div className="store-form-group">

                    <label htmlFor="store-description">
                        Description
                    </label>


                    {editing ? (

                        <textarea
                            id="store-description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            rows={5}
                        />

                    ) : (

                        <div className="store-value store-description">

                            {storeDescription}

                        </div>

                    )}

                </div>


                {/* ERROR */}

                {error && (

                    <div className="store-message store-error">

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="store-message store-success">

                        {success}

                    </div>

                )}


                {/* ACTIONS */}

                {editing && (

                    <div className="store-form-actions">

                        <button
                            type="button"
                            className="store-cancel-button"
                            onClick={handleCancel}
                            disabled={updateMutation.isPending}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="store-save-button"
                            disabled={updateMutation.isPending}
                        >

                            {updateMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                )}

            </form>

        </section>

    );

}