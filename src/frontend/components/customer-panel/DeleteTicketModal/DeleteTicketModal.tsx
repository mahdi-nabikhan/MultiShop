
"use client";

import { Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCustomerTicket } from "@/services/ticket.services";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import "./DeleteTicketModal.css";

interface Props {
    open: boolean;
    close: () => void;
    ticketId: number;
}

export default function DeleteTicketModal({
    open,
    close,
    ticketId,
}: Props) {
    const queryClient = useQueryClient();

    const {
        mutate: handleDeleteTicket,
        isPending,
    } = useMutation({
        mutationFn: () => deleteCustomerTicket(ticketId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["customer", "tickets"],
            });

            await queryClient.invalidateQueries({
                queryKey: customerQueryKeys.ticket(ticketId),
            });

            close();
        },

        onError: (error) => {
            console.error(
                "DELETE TICKET ERROR:",
                error
            );
        },
    });

    if (!open) {
        return null;
    }

    return (
        <div className="delete-ticket-overlay">
            <div className="delete-ticket-modal">
                <button
                    className="delete-close"
                    onClick={close}
                    disabled={isPending}
                >
                    <X size={22} />
                </button>

                <div className="delete-ticket-icon">
                    <Trash2 size={38} />
                </div>

                <h2>
                    Delete Ticket?
                </h2>

                <p>
                    Are you sure you want to delete this ticket?
                    This action cannot be undone.
                </p>

                <div className="delete-ticket-actions">
                    <button
                        className="cancel-delete-ticket"
                        onClick={close}
                        disabled={isPending}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-ticket"
                        onClick={() => handleDeleteTicket()}
                        disabled={isPending}
                    >
                        <Trash2 size={18} />

                        {isPending
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
