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

import "./CustomerTicketList.css";

export default function CustomerTicketList() {
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useCustomerTickets(page, pageSize);

    if (isLoading) {
        return (
            <div className="ticket-loading">
                Loading Tickets...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="ticket-loading">
                Failed to load tickets.
            </div>
        );
    }

    if (!data) {
        return (
            <div className="ticket-loading">
                No tickets found.
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

                {tickets.length > 0 ? (

                    tickets.map((ticket) => (

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
                                    {ticket.content.length > 120
                                        ? `${ticket.content.slice(0, 120)}...`
                                        : ticket.content}
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

                    ))

                ) : (

                    <div className="ticket-loading">
                        No tickets found.
                    </div>

                )}

            </div>

            <Pagination
                next={data.links.next}
                previous={data.links.previous}
                loading={isFetching}
                onNext={() => setPage((prev) => prev + 1)}
                onPrevious={() => setPage((prev) => prev - 1)}
            />

        </section>
    );
}