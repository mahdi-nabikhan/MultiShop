'use client'

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import './AddDiscountModal.css'

import { createProductDiscount } from '@/services/shop-admin-panel.services'
interface Props {
    open: boolean;
    onClose: () => void;
    productId: number;
}

function AddDiscountModal({
    open,
    onClose,
    productId
}: Props) {
    const queryClient = useQueryClient();
    const [value, setValue] = useState('')
    const [discountType, setDiscountType] = useState<'cash' | 'percent'>('cash')
    const createDiscountMutation = useMutation({
    mutationFn: (discountValue: number) =>
        createProductDiscount(
            productId,
            {
                value: discountValue,
                discount_type: discountType,
            }
        ),

    onSuccess: () => {

        queryClient.invalidateQueries({
            queryKey: [
                "product-discounts",
                productId,
            ],
        });

        setValue("");
        setDiscountType("cash");

        onClose();
    },

    onError: (error) => {

        console.error(
            "Create discount error:",
            error
        );

        alert("Something went wrong");
    },
});
    if (!open) return null


    const submitHandler = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const discountValue = Number(value);


        // ==========================================
        // Validation
        // ==========================================

        if (!value.trim()) {

            alert("Discount value is required.");

            return;

        }


        if (Number.isNaN(discountValue)) {

            alert("Discount value must be a valid number.");

            return;

        }


        if (discountValue <= 0) {

            alert(
                "Discount value must be greater than 0."
            );

            return;

        }


        if (
            discountType === "percent" &&
            discountValue > 100
        ) {

            alert(
                "Percentage discount cannot exceed 100."
            );

            return;

        }


        // ==========================================
        // Create Discount
        // ==========================================

        createDiscountMutation.mutate(discountValue);

    };



    return (
        <div className="modal-overlay">

            <div className="discount-modal">

                <h2>Add Discount</h2>

                <p>
                    Create a discount for this product.
                </p>

                <form onSubmit={submitHandler}>

                    <div className="form-group">

                        <label>Discount Value</label>

                        <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                                setValue(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Discount Type</label>

                        <select
                            value={discountType}
                            onChange={(e) =>
                                setDiscountType(
                                    e.target.value as "cash" | "percent"
                                )
                            }
                        >

                            <option value="cash">
                                Cash
                            </option>

                            <option value="percent">
                                Percent
                            </option>

                        </select>

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={createDiscountMutation.isPending}
                        >
                            {createDiscountMutation.isPending
                                ? "Creating..."
                                : "Create Discount"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddDiscountModal