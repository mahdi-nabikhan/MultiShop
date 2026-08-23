"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopTickets } from "@/services/shop-admin-panel.services";
import "./ShopTicketList.css";

export default function ShopTicketList() {

    const {
        data: tickets = [],
        isPending,
        isError,
    } = useQuery({
        queryKey: ["shop-tickets"],
        queryFn: getShopTickets,
    });

    if (isPending) {
        return <h2>Loading...</h2>;
    }

    if (isError) {
        return <h2>Failed to load tickets.</h2>;
    }

    if (tickets.length === 0) {
        return <h2>No Tickets Found</h2>;
    }

    return (

        <div className="ticket-page">

            <div className="ticket-header">

                <h1>Support Tickets</h1>

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

                                {ticket.customer.username}

                            </div>

                        </div>

                        <p className="ticket-content">

                            {ticket.content}

                        </p>

                        <div className="ticket-footer">

                            <span>

                                Customer ID: {ticket.customer.id}

                            </span>

                            <button>

                                View Ticket

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}