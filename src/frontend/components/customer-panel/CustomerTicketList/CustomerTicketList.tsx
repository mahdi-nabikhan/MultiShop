"use client";

import { useState } from "react";
import Link from "next/link";

import {
    Ticket,
    Store,
    ChevronRight,
} from "lucide-react";

import useCustomerTickets from "@/hooks/customer/useCustomerTickets";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import "./CustomerTicketList.css";


export default function CustomerTicketList() {


    const [page, setPage] = useState(1);

    const pageSize = 8;


    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useCustomerTickets(
        page,
        pageSize
    );



    // ==========================
    // Loading
    // ==========================

    if (isLoading) {
        return (
            <div className="ticket-loading">
                <Skeleton count={8} />
            </div>
        );
    }



    // ==========================
    // Error
    // ==========================

    if (isError) {
        return (
            <div className="ticket-loading">
                <ErrorState message="Failed to load tickets." />
            </div>
        );
    }



    // ==========================
    // Empty
    // ==========================

    if (!data || data.results.length === 0) {
        return (
            <div className="ticket-loading">
                <EmptyState message="No tickets found." />
            </div>
        );
    }



    const tickets = data.results;



    return (

        <section className="customer-ticket-list">


            <div className="ticket-header">


                <h2>
                    My Tickets
                </h2>


                <span>
                    {data.count} Tickets
                </span>


            </div>




            <div className="ticket-grid">


                {tickets.map((ticket) => (

                    <div

                        className="ticket-card"

                        key={ticket.pk}

                    >



                        <div className="ticket-icon">

                            <Ticket size={30} />

                        </div>




                        <div className="ticket-content">


                            <h3>
                                {ticket.title}
                            </h3>




                            <p>

                                {
                                    ticket.content.length > 120
                                        ? `${ticket.content.slice(0, 120)}...`
                                        : ticket.content
                                }

                            </p>




                            <div className="ticket-footer">


                                <div className="ticket-store">

                                    <Store size={16} />

                                    Store #{ticket.store}

                                </div>




                                <Link

                                    href={`/customer-panel/tickets/${ticket.pk}`}

                                    className="ticket-detail-btn"

                                >

                                    View

                                    <ChevronRight size={16} />

                                </Link>


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