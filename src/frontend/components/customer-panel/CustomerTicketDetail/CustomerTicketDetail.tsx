"use client";

import { useState } from "react";

import {
    ArrowLeft,
    Store,
    User,
    MessageSquare,
    Edit,
    Trash2,
} from "lucide-react";

import Link from "next/link";

import useCustomerTicketDetail from "@/hooks/customer/useCustomerTicketDetail";
    

import EditTicketModal
    from "../EditTicketModal/EditTicketModal";

import DeleteTicketModal
    from "../DeleteTicketModal/DeleteTicketModal";

import "./CustomerTicketDetail.css";


interface Props {
    ticketId: number;
}


export default function CustomerTicketDetail({
    ticketId,
}: Props) {

    const {
        ticket,
        replies,
        isLoading,
        isError,
        refresh,
    } = useCustomerTicketDetail(ticketId);


    const [openEdit, setOpenEdit] =
        useState(false);

    const [openDelete, setOpenDelete] =
        useState(false);


    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {

        return (
            <div className="ticket-loading">
                Loading...
            </div>
        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError) {

        return (
            <div className="ticket-loading">
                Failed to load ticket.
            </div>
        );

    }


    // ==========================================
    // Not Found
    // ==========================================

    if (!ticket) {

        return (
            <div className="ticket-loading">
                Ticket Not Found
            </div>
        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="customer-ticket-detail">


            <Link
                href="/customer-panel/tickets"
                className="ticket-back"
            >

                <ArrowLeft size={18} />

                Back To Tickets

            </Link>


            {/* ==================================
                TICKET
            ================================== */}

            <div className="ticket-detail-card">


                <div className="ticket-top">


                    <div>

                        <h1>
                            {ticket.title}
                        </h1>

                        <p>
                            {ticket.content}
                        </p>

                    </div>


                    <div className="ticket-actions">


                        <button
                            className="ticket-edit-btn"
                            onClick={() =>
                                setOpenEdit(true)
                            }
                        >

                            <Edit size={18} />

                            Edit

                        </button>


                        <button
                            className="ticket-delete-btn"
                            onClick={() =>
                                setOpenDelete(true)
                            }
                        >

                            <Trash2 size={18} />

                            Delete

                        </button>


                    </div>


                </div>


                <div className="ticket-info">


                    <div>

                        <User size={18} />

                        {ticket.customer.username}

                    </div>


                    <div>

                        <Store size={18} />

                        Store #{ticket.store}

                    </div>


                </div>


            </div>


            {/* ==================================
                CONVERSATION
            ================================== */}

            <div className="conversation">


                <h2>
                    Conversation
                </h2>


                <div className="conversation-list">


                    {/* Customer Message */}

                    <div className="customer-message">


                        <div className="message-badge">
                            Customer
                        </div>


                        <div className="message-box">

                            <MessageSquare size={18} />

                            <p>
                                {ticket.content}
                            </p>

                        </div>


                    </div>


                    {/* Support Replies */}

                    {replies.map((reply) => (

                        <div
                            className="support-message"
                            key={reply.pk}
                        >


                            <div className="message-badge support">

                                Support

                            </div>


                            <div className="message-box">

                                <MessageSquare size={18} />

                                <p>
                                    {reply.content}
                                </p>

                            </div>


                        </div>

                    ))}


                </div>


            </div>


            {/* ==================================
                EDIT
            ================================== */}

            <EditTicketModal

                open={openEdit}

                close={() =>
                    setOpenEdit(false)
                }

                ticket={ticket}


            />


            {/* ==================================
                DELETE
            ================================== */}

            <DeleteTicketModal

                open={openDelete}

                close={() =>
                    setOpenDelete(false)
                }

                ticketId={ticket.pk}

            />


        </section>

    );

}