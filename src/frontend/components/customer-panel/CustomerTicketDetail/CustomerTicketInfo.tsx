"use client";

import {
    Store,
    User,
    Edit,
    Trash2,
} from "lucide-react";

interface CustomerTicketInfoProps {
    ticket: {
        title: string;
        content: string;
        customer: {
            username: string;
        };
        store: number;
    };
    onEdit: () => void;
    onDelete: () => void;
}

function CustomerTicketInfo({
    ticket,
    onEdit,
    onDelete,
}: CustomerTicketInfoProps) {
    return (
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
                        type="button"
                        className="ticket-edit-btn"
                        onClick={onEdit}
                    >
                        <Edit size={18} />
                        Edit
                    </button>

                    <button
                        type="button"
                        className="ticket-delete-btn"
                        onClick={onDelete}
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
    );
}

export default CustomerTicketInfo;