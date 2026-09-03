"use client";

import { useState } from "react";

import DeleteDiscountModal from "../DeleteDiscountModal/DeleteDiscountModal";

import Pagination from "@/components/commen/Paginations";

import useProductDiscounts from "@/hooks/admin-panel/useProductDiscounts";

function DiscountList({ productId }: { productId: number }) {

    const [page, setPage] = useState(1);

    const pageSize = 8;

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedDiscount, setSelectedDiscount] =
        useState<number | null>(null);

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useProductDiscounts(
        productId,
        page,
        pageSize
    );


    if (isLoading) {
        return <h3>Loading...</h3>;
    }


    if (isError) {
        return <h3>Failed to load discounts.</h3>;
    }


    const discounts = data?.results ?? [];


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

                                        setSelectedDiscount(
                                            discount.id
                                        );

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


            {data && (
                <Pagination
                    next={data.links.next}
                    previous={data.links.previous}
                    loading={isFetching}
                    onNext={() =>
                        setPage((prev) => prev + 1)
                    }
                    onPrevious={() =>
                        setPage((prev) => prev - 1)
                    }
                />
            )}


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