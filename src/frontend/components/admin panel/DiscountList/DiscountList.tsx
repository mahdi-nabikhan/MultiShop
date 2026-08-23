"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductDiscounts } from "@/services/shop-admin-panel.services";

import DeleteDiscountModal from "../DeleteDiscountModal/DeleteDiscountModal";



function DiscountList({ productId }: { productId: number }) {


    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);

    const {data: discounts = [],isLoading,isError} = useQuery({
        queryKey: ["product-discounts", productId],
        queryFn: () => getProductDiscounts(productId)});


    
    if (isLoading) {

        return <h3>Loading...</h3>;

    }

    if (isError) {
        return <h3>Failed to load discounts.</h3>;
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
                       
                    />

                )

            }

        </>

    );

}

export default DiscountList;