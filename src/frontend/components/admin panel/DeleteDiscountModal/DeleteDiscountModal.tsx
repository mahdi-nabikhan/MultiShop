"use client";

import { useState } from "react";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { deleteProductDiscount } from "@/services/product.services";
import "./DeleteDiscountModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    discountId: number;

}

export default function DeleteDiscountModal({
    open,
    onClose,
    discountId,

}: Props) {
    console.log('this is discount id', discountId)

    if (!open) return null;
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteProductDiscount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["product-discounts"],
            });

            onClose();
        },

        onError: (err) => {
            console.log(err);
            alert("Failed to delete discount.");
        },
    });
    const deleteHandler = () => {
        deleteMutation.mutate(discountId);
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
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={deleteHandler}
                        disabled={deleteMutation.isPending}
                    >
                        {
                            deleteMutation.isPending
                                ? "Deleting..."
                                : "Delete"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

}