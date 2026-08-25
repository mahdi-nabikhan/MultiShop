"use client";

import { useEffect, useState } from "react";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { Ticket } from "@/types/ticket";
import { updateCustomerTicket } from "@/services/ticket.services";

import {
    X,
    Save,
} from "lucide-react";

import { customerQueryKeys } from "@/Lib/query-keys/customer.keys"; 

import "./EditTicketModal.css";


interface Props {
    open: boolean;
    close: () => void;
    ticket: Ticket;
}


export default function EditTicketModal({
    open,
    close,
    ticket,
}: Props) {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const queryClient = useQueryClient();


    useEffect(() => {

        if (ticket) {

            setTitle(ticket.title);
            setContent(ticket.content);

        }

    }, [ticket]);


    const {
        mutate: updateTicket,
        isPending,
    } = useMutation({

        mutationFn: () =>
            updateCustomerTicket(
                ticket.pk,
                {
                    title,
                    content,
                    store: ticket.store,
                }
            ),

        onSuccess: async () => {

            await queryClient.invalidateQueries({
                queryKey:
                    customerQueryKeys.tickets(),
            });


            await queryClient.invalidateQueries({
                queryKey:
                    customerQueryKeys.ticket(ticket.pk),
            });


            await queryClient.invalidateQueries({
                queryKey:
                    customerQueryKeys.ticketReplies(ticket.pk),
            });


            close();

        },

        onError: (error) => {

            console.error(
                "UPDATE TICKET ERROR:",
                error
            );

        },

    });


    if (!open) {

        return null;

    }


    const updateTicketHandler = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        updateTicket();

    };


    return (

        <div className="edit-ticket-overlay">

            <div className="edit-ticket-modal">

                <div className="edit-ticket-header">

                    <h2>
                        Edit Ticket
                    </h2>

                    <button
                        type="button"
                        onClick={close}
                        disabled={isPending}
                    >

                        <X size={22} />

                    </button>

                </div>


                <form
                    onSubmit={updateTicketHandler}
                    className="edit-ticket-form"
                >

                    <label>
                        Title
                    </label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        required
                        disabled={isPending}
                    />


                    <label>
                        Content
                    </label>

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        required
                        disabled={isPending}
                    />


                    <button
                        type="submit"
                        className="save-ticket-btn"
                        disabled={isPending}
                    >

                        <Save size={18} />

                        {
                            isPending
                                ? "Updating..."
                                : "Update Ticket"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}