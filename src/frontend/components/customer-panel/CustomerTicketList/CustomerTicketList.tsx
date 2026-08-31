
"use client";

import Link from "next/link";

import {
    Ticket,
    Store,
    ChevronRight,
} from "lucide-react";

import useCustomerTickets from "@/hooks/customer/useCustomerTickets";

import "./CustomerTicketList.css";

export default function CustomerTicketList() {

    const {
        data: tickets = [],
        isLoading,
        isError,
    } = useCustomerTickets();

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

    return (
        <section className="customer-ticket-list">

            <div className="ticket-header">

                <h2>
                    My Tickets
                </h2>

                <span>
                    {tickets.length} Tickets
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

                ))}

            </div>

        </section>
    );
}
