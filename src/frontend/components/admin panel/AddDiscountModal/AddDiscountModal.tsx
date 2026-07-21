'use client'
import axios from 'axios'
import BACKEND_URLS from '@/utils'
import { useState } from 'react'
import './AddDiscountModal.css'
import React from 'react'

interface Props {
    open: boolean;
    onClose: () => void;
    productId: number;
    refreshDiscounts: () => void;
}

function AddDiscountModal({
    open,
    onClose,
    productId,
    refreshDiscounts
}: Props) {
    const [value, setValue] = useState('')
    const [discountType, setDiscountType] = useState<'cash' | 'percent'>('cash')
    const [loading, setLoading] = useState(false)
    if (!open) return null

    const submitHandler = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        try {
            setLoading(true)
            await axios.post(
                `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,
                {
                    value: Number(value),
                    discount_type: discountType
                },
                {
                    withCredentials: true
                }
            )
            alert('discount created successfully')
            setValue('')
            setDiscountType('cash')
            refreshDiscounts()
            onClose()
        } catch (err) {
            console.log(err)
            alert('something went wrong')

        } finally {
            setLoading(false)

        }
    }

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
                            disabled={loading}
                        >
                            {
                                loading
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