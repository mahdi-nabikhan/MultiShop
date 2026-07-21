"use client";

import { useEffect, useState } from "react";
import "./DiscountList.css";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import DeleteDiscountModal from "../DeleteDiscountModal/DeleteDiscountModal";

interface DiscountData {
    id: number;
    products: number;
    value: number;
    discount_type: "cash" | "percent";
}

function DiscountList({ productId }: { productId: number }) {

    const [discounts, setDiscounts] = useState<DiscountData[]>([]);
    const [loading, setLoading] = useState(true);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);

    const GetDiscounts = async () => {

        try {

            setLoading(true);

            const { data } = await axios.get<DiscountData[]>(
                `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,
                {
                    withCredentials: true,
                }
            );

            setDiscounts(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        GetDiscounts();

    }, [productId]);

    if (loading) {

        return <h3>Loading...</h3>;

    }

    return (

        <>
            <div className="discount-list">

                {discounts.length === 0 && (

                    <div className="empty-discount">

                        No discounts found.

                    </div>

                )}

                {discounts.map((discount) => (

                    <div
                        className="discount-card"
                        key={discount.id}
                    >

                        <div className="discount-top">

                            <span
                                className={
                                    discount.discount_type === "cash"
                                        ? "discount-type cash"
                                        : "discount-type percent"
                                }
                            >
                                {discount.discount_type}
                            </span>

                            <span className="discount-value">

                                {discount.value}

                                {
                                    discount.discount_type === "percent"
                                        ? "%"
                                        : "$"
                                }

                            </span>

                        </div>

                        <div className="discount-footer">

                            <span>

                                Product ID: {discount.products}

                            </span>

                            <div className="discount-actions">

                                <button className="edit-discount">

                                    Edit

                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => {

                                        setSelectedDiscount(discount.id);
                                        setOpenDeleteModal(true);

                                    }}
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {

                selectedDiscount !== null && (

                    <DeleteDiscountModal
                        open={openDeleteModal}
                        onClose={() => {

                            setOpenDeleteModal(false);
                            setSelectedDiscount(null);

                        }}
                        discountId={selectedDiscount}
                        refreshDiscounts={GetDiscounts}
                    />

                )

            }

        </>

    );

}

export default DiscountList;