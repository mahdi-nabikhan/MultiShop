"use client";

import { useState } from "react";

import Pagination from "@/components/commen/Paginations";
import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import useShopTickets from "@/hooks/admin-panel/useShopTickets";

import "./ShopTicketList.css";


export default function ShopTicketList() {

    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useShopTickets(
        page,
        pageSize
    );


    if (isLoading) {
        return (
            <div className="ticket-page">
                <Skeleton count={8} />
            </div>
        );
    }


    if (isError) {
        return (
            <div className="ticket-page">
                <ErrorState
                    message="Failed to load tickets."
                />
            </div>
        );
    }


    const tickets = data?.results ?? [];


    if (tickets.length === 0) {
        return (
            <div className="ticket-page">
                <EmptyState
                    message="No tickets found."
                />
            </div>
        );
    }


    return (

        <div className="ticket-page">


            <div className="ticket-header">

                <h1>
                    Support Tickets
                </h1>

                <p>
                    All customer tickets for your shop
                </p>

            </div>



            <div className="ticket-list">

                {tickets.map((ticket) => (

                    <div
                        className="ticket-card"
                        key={ticket.pk}
                    >


                        <div className="ticket-top">

                            <div>

                                <h2>
                                    {ticket.title}
                                </h2>


                                <span>
                                    Ticket #{ticket.pk}
                                </span>

                            </div>


                            <div className="ticket-user">

                                {
                                    ticket.customer?.username ||
                                    "Unknown Customer"
                                }

                            </div>


                        </div>



                        <p className="ticket-content">

                            {
                                ticket.content.length > 200
                                    ? `${ticket.content.slice(0, 200)}...`
                                    : ticket.content
                            }

                        </p>



                        <div className="ticket-footer">


                            <span>

                                Customer ID: {
                                    ticket.customer?.id || "-"
                                }

                            </span>



                            <button>
                                View Ticket
                            </button>


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
                        setPage(
                            (prev) => prev + 1
                        )
                    }

                    onPrevious={() =>
                        setPage(
                            (prev) => prev - 1
                        )
                    }

                />

            )}


        </div>

    );

}