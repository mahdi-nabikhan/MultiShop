"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
    Send,
    FileText,
    Check,
    CheckCheck,
} from "lucide-react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getConversationMessages,
    sendConversationMessage,
} from "@/services/chat.services";

import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";

import { Message } from "@/types/chat";

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
    } = useQuery<Message[]>({

        queryKey:
            chatQueryKeys.conversationMessages(
                conversationId!
            ),

        queryFn: () =>
            getConversationMessages(
                conversationId!
            ),

        enabled:
            !!conversationId,

        refetchInterval: 3000,

    });


    /* =========================
       SEND MESSAGE
    ========================= */

    const sendMessageMutation =
        useMutation({

            mutationFn: (
                message: string
            ) =>
                sendConversationMessage(
                    conversationId!,
                    message
                ),

            onSuccess: () => {

                setText("");

                queryClient.invalidateQueries({

                    queryKey:
                        chatQueryKeys.conversationMessages(
                            conversationId!
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

            <header className="customer-chat-header">

                <div className="customer-chat-user">

                    <div className="customer-chat-avatar">
                        S
                    </div>

                    <div>

                        <h3>
                            Store Chat
                        </h3>

                        <span>
                            Conversation #{conversationId}
                        </span>

                    </div>

                </div>

            </header>


            {/* BODY */}

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

                        const isCustomer =
                            typeof message.sender === "string" &&
                            typeof currentUserEmail === "string" &&
                            message.sender
                                .trim()
                                .toLowerCase() ===
                            currentUserEmail
                                .trim()
                                .toLowerCase();


                        return (

                            <div
                                key={message.id}
                                className={
                                    `customer-message ${
                                        isCustomer
                                            ? "customer-message-sent"
                                            : "customer-message-received"
                                    }`
                                }
                            >

                                <div className="customer-message-bubble">


                                    {/* SENDER */}

                                    <span className="customer-message-sender">

                                        {isCustomer
                                            ? "You"
                                            : message.sender}

                                    </span>


                                    {/* TEXT */}

                                    {message.text && (

                                        <p>
                                            {message.text}
                                        </p>

                                    )}


                                    {/* IMAGE */}

                                    {message.image && (

                                        <img
                                            src={message.image}
                                            alt="Message"
                                            className="customer-message-image"
                                        />

                                    )}


                                    {/* FILE */}

                                    {message.file && (

                                        <Link
                                            href={message.file}
                                            target="_blank"
                                            className="customer-message-file"
                                        >

                                            <FileText
                                                size={17}
                                            />

                                            Open file

                                        </Link>

                                    )}


                                    {/* FOOTER */}

                                    <div className="customer-message-footer">

                                        <span>

                                            {new Date(
                                                message.created_at
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}

                                        </span>


                                        {isCustomer && (

                                            message.is_read ? (

                                                <CheckCheck
                                                    size={15}
                                                />

                                            ) : (

                                                <Check
                                                    size={15}
                                                />

                                            )

                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}


                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* SEND ERROR */}

            {sendMessageMutation.isError &&
                messages.length > 0 && (

                    <div className="customer-chat-send-error">

                        Failed to send message.

                    </div>

                )}


            {/* INPUT */}

            <div className="customer-chat-input">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    disabled={
                        sendMessageMutation.isPending
                    }
                />


                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                        sendMessageMutation.isPending ||
                        !text.trim()
                    }
                >

                    {sendMessageMutation.isPending ? (

                        "..."

                    ) : (

                        <Send size={18} />

                    )}

                </button>

            </div>


        </section>

    );

}