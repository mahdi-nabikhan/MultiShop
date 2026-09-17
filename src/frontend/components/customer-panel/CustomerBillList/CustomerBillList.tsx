"use client";

import { useState } from "react";

import useBills from "@/hooks/customer/useBills";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import {
    ReceiptText,
    CalendarDays,
    MapPin,
    ShoppingCart,
    CheckCircle,
    XCircle,
} from "lucide-react";

import "./CustomerBillList.css";


export default function CustomerBillList() {

    const [page, setPage] = useState(1);

    const pageSize = 8;


    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useBills(page, pageSize);



    // ==========================
    // Loading
    // ==========================

    if (isLoading) {
        return (
            <div className="bill-loading">
                <Skeleton count={8} />
            </div>
        );
    }



    // ==========================
    // Error
    // ==========================

    if (isError) {
        return (
            <div className="bill-loading">
                <ErrorState message="Failed to load bills." />
            </div>
        );
    }



    // ==========================
    // Empty
    // ==========================

    if (!data || data.results.length === 0) {
        return (
            <div className="bill-loading">
                <EmptyState message="No bills found." />
            </div>
        );
    }



    const bills = data.results;



    return (

        <section className="customer-bill-list">


            <div className="bill-header">

                <h2>
                    My Bills
                </h2>


                <span>
                    {data.count} Bills
                </span>

            </div>



            <div className="bill-grid">

                {bills.map((bill) => (

                    <div
                        className="bill-card"
                        key={bill.id}
                    >

                        <div className="bill-icon">

                            <ReceiptText size={32} />

                        </div>



                        <div className="bill-content">


                            <h3>
                                Bill #{bill.id}
                            </h3>



                            <div className="bill-info">


                                <div>

                                    <CalendarDays size={16} />

                                    {bill.created_at}

                                </div>



                                <div>

                                    <ShoppingCart size={16} />

                                    Cart #{bill.cart.id}

                                </div>



                                <div>

                                    <MapPin size={16} />

                                    Address #{bill.address}

                                </div>


                            </div>




                            <div
                                className={
                                    bill.status
                                        ? "bill-status success"
                                        : "bill-status pending"
                                }
                            >

                                {bill.status ? (

                                    <>
                                        <CheckCircle size={16} />
                                        Paid
                                    </>

                                ) : (

                                    <>
                                        <XCircle size={16} />
                                        Pending
                                    </>

                                )}

                            </div>



                        </div>


                    </div>

                ))}


            </div>




            <Pagination

                next={data.links.next}

                previous={data.links.previous}

                loading={isFetching}

                onNext={() =>
                    setPage((prev) => prev + 1)
                }

                onPrevious={() =>
                    setPage((prev) =>
                        Math.max(1, prev - 1)
                    )
                }

            />


        </section>

    );
}