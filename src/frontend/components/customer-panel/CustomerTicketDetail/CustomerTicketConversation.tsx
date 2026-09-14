"use client";

import { MessageSquare } from "lucide-react";

interface CustomerTicketConversationProps {
    ticketContent: string;
    replies: {
        pk: number;
        content: string;
    }[];
}

function CustomerTicketConversation({
    ticketContent,
    replies,
}: CustomerTicketConversationProps) {
    return (
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
                            {ticketContent}
                        </p>

                    </div>

                </div>

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
    );
}

export default CustomerTicketConversation;