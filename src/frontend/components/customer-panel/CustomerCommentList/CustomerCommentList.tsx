"use client";

import { useState } from "react";

import useCustomerComments from "@/hooks/customer/useCustomerComments";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import {
    MessageCircle,
    CheckCircle,
    Clock,
} from "lucide-react";

import "./CustomerCommentList.css";


export default function CustomerCommentList() {

    const [page, setPage] = useState(1);

    const pageSize = 8;


    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useCustomerComments(
        page,
        pageSize
    );



    // ==========================
    // Loading
    // ==========================

    if (isLoading) {
        return (
            <div className="comments-loading">
                <Skeleton count={8} />
            </div>
        );
    }



    // ==========================
    // Error
    // ==========================

    if (isError) {
        return (
            <div className="comments-loading">
                <ErrorState message="Failed to load comments." />
            </div>
        );
    }



    // ==========================
    // Empty
    // ==========================

    if (!data || data.results.length === 0) {
        return (
            <div className="comments-loading">
                <EmptyState message="No comments found." />
            </div>
        );
    }



    const comments = data.results;



    return (

        <section className="customer-comments">


            <div className="comments-header">

                <h2>
                    My Comments
                </h2>


                <p>
                    Manage your product reviews
                </p>

            </div>



            <div className="comments-list">


                {comments.map((comment) => (

                    <div
                        className="comment-card"
                        key={comment.id}
                    >


                        <div className="comment-icon">

                            <MessageCircle size={28} />

                        </div>



                        <div className="comment-content">


                            <h3>
                                Product #{comment.product}
                            </h3>



                            <p>
                                {comment.descriptions}
                            </p>



                            <div className="comment-meta">


                                <span>

                                    {comment.status === "C" ? (

                                        <>
                                            <CheckCircle size={16} />
                                            Approved
                                        </>

                                    ) : (

                                        <>
                                            <Clock size={16} />
                                            Pending
                                        </>

                                    )}

                                </span>



                                <small>
                                    {comment.user.email}
                                </small>


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