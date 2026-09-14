
"use client";

import type { RefObject } from "react";

import type { Message } from "@/types/chat";

import CustomerChatMessage from "./CustomerChatMessage";

interface CustomerChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
    isError: boolean;
    currentUserEmail: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

function CustomerChatMessages({
    messages,
    isLoading,
    isError,
    currentUserEmail,
    messagesEndRef,
}: CustomerChatMessagesProps) {
    const normalizedCurrentUser =
        currentUserEmail.trim().toLowerCase();

    return (
        <div className="customer-chat-body">

            {isLoading ? (
                <div className="customer-chat-loading">
                    Loading messages...
                </div>
            ) : isError ? (
                <div className="customer-chat-error">
                    Failed to load messages.
                </div>
            ) : messages.length === 0 ? (
                <div className="customer-chat-no-messages">
                    <p>
                        No messages yet.
                    </p>
                </div>
            ) : (
                messages.map((message) => {
                    const sender =
                        typeof message.sender === "string"
                            ? message.sender
                                .trim()
                                .toLowerCase()
                            : "";

                    const isCustomer =
                        sender === normalizedCurrentUser;

                    return (
                        <CustomerChatMessage
                            key={message.id}
                            message={message}
                            isCustomer={isCustomer}
                        />
                    );
                })
            )}

            <div ref={messagesEndRef} />

        </div>
    );
}

export default CustomerChatMessages;

