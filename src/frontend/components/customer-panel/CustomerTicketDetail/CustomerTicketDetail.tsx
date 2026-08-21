"use client";

import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Store,
    User,
    MessageSquare,
    Edit,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { getCustomerTicketDetail, getCustomerTicketReplies } from "@/services/ticket.services";

import EditTicketModal from "../EditTicketModal/EditTicketModal";
import DeleteTicketModal from "../DeleteTicketModal/DeleteTicketModal";
import type { CustomerTicketDetailProp,TicketReplyProp} from "@/types/ticket";
import "./CustomerTicketDetail.css";



interface Props {

    ticketId: number;

}

export default function CustomerTicketDetail({

    ticketId

}: Props) {

    const [ticket, setTicket] = useState<CustomerTicketDetailProp | null>(null);

    const [replies, setReplies] = useState<TicketReplyProp[]>([]);

    const [loading, setLoading] = useState(true);

    const [openEdit, setOpenEdit] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);



    const getTicket = async () => {

        try {

            const data =
                await getCustomerTicketDetail(ticketId);

            setTicket(data);

        } catch (error) {

            console.error(
                "GET TICKET DETAIL ERROR:",
                error
            );

        }

    };

    const getReplies = async () => {

        try {

            const data =
                await getCustomerTicketReplies(ticketId);

            setReplies(data);

        } catch (error) {

            console.error(
                "GET TICKET REPLIES ERROR:",
                error
            );

        }

    };






    const Refresh = async () => {

        setLoading(true);

        await Promise.all([

            getTicket(),

            getReplies()

        ]);

        setLoading(false);

    };



    useEffect(() => {

        Refresh();

    }, [ticketId]);



    if (loading) {

        return (

            <div className="ticket-loading">

                Loading...

            </div>

        );

    }



    if (!ticket) {

        return (

            <div className="ticket-loading">

                Ticket Not Found

            </div>

        );

    }



    return (

        <section className="customer-ticket-detail">

            <Link

                href="/customer-panel/tickets"

                className="ticket-back"

            >

                <ArrowLeft size={18} />

                Back To Tickets

            </Link>



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

                            onClick={() => setOpenEdit(true)}

                        >

                            <Edit size={18} />

                            Edit

                        </button>

                        <button

                            className="ticket-delete-btn"

                            onClick={() => setOpenDelete(true)}

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



            <div className="conversation">

                <h2>

                    Conversation

                </h2>

                <div className="conversation-list">

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

                    {

                        replies.map(reply => (

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

                        ))

                    }

                </div>

            </div>



            <EditTicketModal

                open={openEdit}

                close={() => setOpenEdit(false)}

                ticket={ticket}

                refresh={Refresh}

            />



            <DeleteTicketModal

                open={openDelete}

                close={() => setOpenDelete(false)}

                ticketId={ticket.pk}

            />

        </section>

    );

}