"use client";

import { useEffect, useState } from "react";
import { getShopTickets } from "@/services/shop-admin-panel.services";
import "./ShopTicketList.css";
import { Ticket } from "@/types/panel-admin";

export default function ShopTicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const getTickets = async () => {

        try {

            setLoading(true);

            const data = await getShopTickets();

            setTickets(data);

        } catch (err) {

            console.error(
                "Failed to load tickets:",
                err
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        getTickets();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
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

                                <h2>{ticket.title}</h2>

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