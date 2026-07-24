"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";
import "./ShopTicketList.css";

interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

interface Ticket {
    pk: number;
    title: string;
    content: string;
    store: number;
    customer: Customer;
}

export default function ShopTicketList() {

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const getTickets = async () => {

        try {

            const { data } = await axios.get<Ticket[]>(
                `${BACKEND_URLS}dashboard/api/v1/shop/all/ticket/`,
                {
                    withCredentials: true,
                }
            );

            setTickets(data);

        } catch (err) {

            console.log(err);

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