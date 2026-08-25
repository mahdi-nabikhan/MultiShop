"use client";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";

import {
    Ticket,
    Store,
    ChevronRight
} from "lucide-react";

import { getCustomerTickets } from "@/services/cutomer-panel.services";
import type { CustomerTicket } from "@/types/ticket";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys"; 

import "./CustomerTicketList.css";


export default function CustomerTicketList() {

    const {
        data: tickets = [],
        isLoading,
        isError,
    } = useQuery({

        queryKey: customerQueryKeys.tickets(),

        queryFn: getCustomerTickets,

    });


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

                {

                    tickets.map(ticket => (

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

                                            ?

                                            ticket.content.slice(0, 120) + "..."

                                            :

                                            ticket.content

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

                    ))

                }

            </div>


        </section>

    );

}