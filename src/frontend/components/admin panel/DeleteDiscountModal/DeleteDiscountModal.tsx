"use client";

import { useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./DeleteDiscountModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    discountId: number;
    refreshDiscounts: () => void;
}

export default function DeleteDiscountModal({
    open,
    onClose,
    discountId,
    refreshDiscounts,
}: Props) {

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const deleteHandler = async () => {

        try {

            setLoading(true);

            await axios.delete(
                `${BACKEND_URLS}vendor/api/v1/delete/discount/${discountId}/`,
                {
                    withCredentials: true,
                }
            );

            refreshDiscounts();

            onClose();

        } catch (err) {

            console.log(err);

            alert("Failed to delete discount.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="delete-modal-overlay">

            <div className="delete-modal">

                <div className="delete-icon">
                    🗑️
                </div>

                <h2>Delete Discount</h2>

                <p>
                    Are you sure you want to delete this discount?
                    <br />
                    This action cannot be undone.
                </p>

                <div className="delete-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={deleteHandler}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Deleting..."
                                : "Delete"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

}