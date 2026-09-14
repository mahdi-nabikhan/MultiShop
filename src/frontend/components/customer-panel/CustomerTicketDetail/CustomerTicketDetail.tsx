"use client";

import { useState } from "react";

import {
    ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import useCustomerTicketDetail
    from "@/hooks/customer/useCustomerTicketDetail";

import EditTicketModal
    from "../EditTicketModal/EditTicketModal";

import DeleteTicketModal
    from "../DeleteTicketModal/DeleteTicketModal";

import Skeleton
    from "@/components/commen/Skeleton";

import ErrorState
    from "@/components/commen/ErrorState";

import EmptyState
    from "@/components/commen/EmptyState";

import CustomerTicketInfo
    from "./CustomerTicketInfo";

import CustomerTicketConversation
    from "./CustomerTicketConversation";

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
    } = useCustomerTicketDetail(ticketId);

    const [openEdit, setOpenEdit] =
        useState(false);

    const [openDelete, setOpenDelete] =
        useState(false);


    if (isLoading) {

        return (
            <div className="ticket-loading">
                <Skeleton count={4} />
            </div>
        );

    }


    if (isError) {

        return (
            <div className="ticket-loading">
                <ErrorState
                    message="Failed to load ticket."
                />
            </div>
        );

    }


    if (!ticket) {

        return (
            <div className="ticket-loading">
                <EmptyState
                    message="Ticket not found."
                />
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

            <CustomerTicketInfo
                ticket={ticket}
                onEdit={() =>
                    setOpenEdit(true)
                }
                onDelete={() =>
                    setOpenDelete(true)
                }
            />

            <CustomerTicketConversation
                ticketContent={ticket.content}
                replies={replies}
            />

            <EditTicketModal
                open={openEdit}
                close={() =>
                    setOpenEdit(false)
                }
                ticket={ticket}
            />

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