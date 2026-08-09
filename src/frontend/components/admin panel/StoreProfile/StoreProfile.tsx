"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

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


    const [store, setStore] =
        useState<StoreData | null>(null);


    const [formData, setFormData] =
        useState<StoreFormData>({
            name: "",
            description: "",
        });


    const [editing, setEditing] =
        useState(false);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    /* =========================
       GET STORE
    ========================= */

    async function getStore() {

        try {

            setLoading(true);

            setError("");


            const response = await axios.get<StoreData>(

                `${BACKEND_URLS}vendor/api/v1/store/detail/`,

                {
                    withCredentials: true,
                }

            );


            console.log(
                "STORE RESPONSE:",
                response.data
            );


            const data = response.data;


            setStore(data);


            setFormData({

                name: data.name ?? "",

                description:
                    data.description ?? "",

            });


        } catch (error) {

            console.error(
                "GET STORE ERROR:",
                error
            );


            setError(
                "Failed to load store information."
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        getStore();

    }, []);



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
            value
        } = e.target;


        setFormData(
            (prev) => ({

                ...prev,

                [name]: value,

            })
        );

    }



    /* =========================
       UPDATE STORE
    ========================= */

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const response =
                await axios.put<StoreData>(

                    `${BACKEND_URLS}vendor/api/v1/store/detail/`,

                    formData,

                    {
                        withCredentials: true,
                    }

                );


            console.log(
                "UPDATED STORE:",
                response.data
            );


            const updatedStore =
                response.data;


            /*
             * Merge کردن اطلاعات جدید
             * با اطلاعات قبلی
             */

            setStore(
                (prev) => ({

                    ...prev,

                    ...updatedStore,

                    name:
                        updatedStore.name ??
                        formData.name,

                    description:
                        updatedStore.description ??
                        formData.description,

                })
            );


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


        } catch (error: any) {

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

                    /*
                     * اگر Django/DRF
                     * validation error بدهد
                     */

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

        } finally {

            setSaving(false);

        }

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

    if (!store) {

        return (

            <div className="store-profile-error">

                {error ||
                    "Store information not found."}

            </div>

        );

    }



    /*
     * مقادیر امن برای جلوگیری
     * از undefined
     */

    const storeName =
        store.name ?? "Unnamed Store";


    const storeDescription =
        store.description ??
        "No description provided.";


    const storeInitial =
        storeName
            .charAt(0)
            .toUpperCase() || "S";



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
                            disabled={saving}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="store-save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>


                    </div>

                )}

            </form>


        </section>

    );

}