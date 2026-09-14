import type { RefObject } from "react";

import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import AdminChatMessage from "./AdminChatMessage";

interface AdminChatMessageData {
    id: number;
    sender?: string | null;
    text?: string | null;
    image?: string | null;
    file?: string | null;
    created_at: string;
    is_read?: boolean;
}

interface AdminChatMessagesProps {
    messages: AdminChatMessageData[];
    loading: boolean;
    error: string;
    currentUserEmail: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

function AdminChatMessages({
    messages,
    loading,
    error,
    currentUserEmail,
    messagesEndRef,
}: AdminChatMessagesProps) {
    const normalizedCurrentUser =
        currentUserEmail.trim().toLowerCase();

    return (
        <div className="admin-chat-body">
            {loading && messages.length === 0 ? (
                <Skeleton count={5} />
            ) : error && messages.length === 0 ? (
                <ErrorState
                    message="Failed to load messages."
                />
            ) : messages.length === 0 ? (
                <EmptyState
                    message="No messages yet."
                />
            ) : (
                messages.map((message) => {
                    const sender =
                        (message.sender || "")
                            .trim()
                            .toLowerCase();

                    const isAdmin =
                        sender === normalizedCurrentUser;

                    return (
                        <AdminChatMessage
                            key={message.id}
                            message={message}
                            isAdmin={isAdmin}
                        />
                    );
                })
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default AdminChatMessages;