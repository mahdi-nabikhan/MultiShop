
"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    sendConversationMessage,
} from "@/services/chat.services";

import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";

import useConversationMessages from "@/hooks/customer/useConversationMessages";

import CustomerChatHeader from "./CustomerChatHeader";
import CustomerChatMessages from "./CustomerChatMessages";
import CustomerChatInput from "./CustomerChatInput";

import "./CustomerChatBox.css";

interface Props {
    conversationId: number | null;
    currentUserEmail: string;
}

export default function CustomerChatBox({
    conversationId,
    currentUserEmail,
}: Props) {
    const [text, setText] = useState("");

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const queryClient =
        useQueryClient();

    /* =========================
       GET MESSAGES
    ========================= */

    const {
        data: messages = [],
        isLoading,
        isError,
    } = useConversationMessages(
        conversationId
    );

    /* =========================
       SEND MESSAGE
    ========================= */

    const sendMessageMutation =
        useMutation({
            mutationFn: (
                message: string
            ) => {
                if (!conversationId) {
                    throw new Error(
                        "Conversation ID is required"
                    );
                }

                return sendConversationMessage(
                    conversationId,
                    message
                );
            },

            onSuccess: () => {
                setText("");

                if (!conversationId) {
                    return;
                }

                queryClient.invalidateQueries({
                    queryKey:
                        chatQueryKeys.conversationMessages(
                            conversationId
                        ),
                });
            },
        });

    /* =========================
       SEND MESSAGE HANDLER
    ========================= */

    const sendMessage = () => {
        if (!conversationId) {
            return;
        }

        if (!text.trim()) {
            return;
        }

        sendMessageMutation.mutate(
            text.trim()
        );
    };

    /* =========================
       AUTO SCROLL
    ========================= */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    /* =========================
       ENTER KEY
    ========================= */

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

    /* =========================
       EMPTY STATE
    ========================= */

    if (!conversationId) {
        return (
            <section className="customer-chatbox empty">
                <div className="customer-chat-empty">
                    <div className="customer-chat-empty-icon">
                        💬
                    </div>

                    <h2>
                        Select a conversation
                    </h2>

                    <p>
                        Select a conversation
                        from the list to continue chatting.
                    </p>
                </div>
            </section>
        );
    }

    /* =========================
       RENDER
    ========================= */

    return (
        <section className="customer-chatbox">

            {/* HEADER */}

            <CustomerChatHeader
                conversationId={
                    conversationId
                }
            />

            {/* BODY */}

            <CustomerChatMessages
                messages={messages}
                isLoading={isLoading}
                isError={isError}
                currentUserEmail={
                    currentUserEmail
                }
                messagesEndRef={
                    messagesEndRef
                }
            />

            {/* SEND ERROR */}

            {sendMessageMutation.isError &&
                messages.length > 0 && (
                    <div className="customer-chat-send-error">
                        Failed to send message.
                    </div>
                )}

            {/* INPUT */}

            <CustomerChatInput
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
