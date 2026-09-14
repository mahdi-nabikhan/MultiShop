"use client";

import { useRef, useState } from "react";

import useConversationMessages from "@/hooks/customer/useConversationMessages";
import useSendConversationMessage from "@/hooks/admin-panel/useSendConversationMessage";

import AdminChatHeader from "./AdminChatHeader";
import AdminChatMessages from "./AdminChatMessages";
import AdminChatInput from "./AdminChatInput";

import "./AdminChatBox.css";

interface Props {
    conversationId: number | null;
    currentUserEmail: string;
}

export default function AdminChatBox({
    conversationId,
    currentUserEmail,
}: Props) {
    // ==========================================
    // State
    // ==========================================

    const [text, setText] = useState("");

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    // ==========================================
    // Get Messages
    // ==========================================

    const {
        data: messages = [],
        isLoading: loading,
        isError,
    } = useConversationMessages(
        conversationId
    );

    const error = isError
        ? "Failed to load messages."
        : "";

    // ==========================================
    // Send Message
    // ==========================================

    const sendMessageMutation =
        useSendConversationMessage();

    const sendMessage = () => {
        if (!conversationId) {
            return;
        }

        const cleanText =
            text.trim();

        if (!cleanText) {
            return;
        }

        sendMessageMutation.mutate({
            conversationId,
            text: cleanText,
        });

        setText("");
    };

    // ==========================================
    // Enter
    // ==========================================

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();

            sendMessage();
        }
    };

    // ==========================================
    // Empty Conversation Selection
    // ==========================================

    if (!conversationId) {
        return (
            <section className="admin-chatbox empty">
                <div className="admin-chat-empty">
                    <div className="admin-chat-empty-icon">
                        💬
                    </div>

                    <h2>
                        Select a conversation
                    </h2>

                    <p>
                        Select a customer conversation
                        from the list to start chatting.
                    </p>
                </div>
            </section>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <section className="admin-chatbox">

            {/* ==================================
                HEADER
            ================================== */}

            <AdminChatHeader
                conversationId={conversationId}
            />

            {/* ==================================
                BODY
            ================================== */}

            <AdminChatMessages
                messages={messages}
                loading={loading}
                error={error}
                currentUserEmail={
                    currentUserEmail
                }
                messagesEndRef={
                    messagesEndRef
                }
            />

            {/* ==================================
                ERROR
            ================================== */}

            {error && messages.length > 0 && (
                <div className="admin-chat-send-error">
                    {error}
                </div>
            )}

            {/* ==================================
                INPUT
            ================================== */}

            <AdminChatInput
                text={text}
                isPending={
                    sendMessageMutation.isPending
                }
                onChange={setText}
                onSend={sendMessage}
                onKeyDown={handleKeyDown}
            />

        </section>
    );
}