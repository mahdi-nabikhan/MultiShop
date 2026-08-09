"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";

import { Send, FileText, Check, CheckCheck } from "lucide-react";

import BACKEND_URLS from "@/utils";

import "./AdminChatBox.css";

interface Message {
    id: number;
    text: string;
    image: string | null;
    file: string | null;
    created_at: string;
    sender: number;
    sender_name?: string;
    is_read: boolean;
    reply_to?: number | null;
}

interface Props {
    conversationId: number | null;
    currentUserId: number;
}

export default function AdminChatBox({
    conversationId,
    currentUserId,
}: Props) {

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [text, setText] =
        useState("");

    const [error, setError] =
        useState("");

    const messagesEndRef =
        useRef<HTMLDivElement>(null);


    /* =========================
       GET MESSAGES
    ========================= */

    const getMessages = async () => {

        if (!conversationId) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await axios.get<Message[]>(
                `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/list/`,
                {
                    withCredentials: true,
                }
            );

            setMessages(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Failed to load messages."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================
       LOAD WHEN CONVERSATION CHANGES
    ========================= */

    useEffect(() => {

        setMessages([]);

        if (conversationId) {
            getMessages();
        }

    }, [conversationId]);


    /* =========================
       AUTO REFRESH
    ========================= */

    useEffect(() => {

        if (!conversationId) {
            return;
        }

        const interval = setInterval(() => {

            getMessages();

        }, 3000);

        return () => {

            clearInterval(interval);

        };

    }, [conversationId]);


    /* =========================
       AUTO SCROLL
    ========================= */

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    /* =========================
       SEND MESSAGE
    ========================= */

    const sendMessage = async () => {

        if (!conversationId) {
            return;
        }

        if (!text.trim()) {
            return;
        }

        try {

            setSending(true);
            setError("");

            await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/`,

                {
                    text: text.trim(),
                },

                {
                    withCredentials: true,
                }

            );

            setText("");

            await getMessages();

        } catch (error) {

            console.error(error);

            setError(
                "Failed to send message."
            );

        } finally {

            setSending(false);

        }

    };


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
       NO CONVERSATION
    ========================= */

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


    /* =========================
       RENDER
    ========================= */

    return (

        <section className="admin-chatbox">


            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-chat-header">

                <div className="admin-chat-user">

                    <div className="admin-chat-avatar">
                        C
                    </div>

                    <div>

                        <h3>
                            Customer #{conversationId}
                        </h3>

                        <span>
                            Conversation
                        </span>

                    </div>

                </div>

            </header>


            {/* =========================
                BODY
            ========================= */}

            <div className="admin-chat-body">


                {loading && messages.length === 0 ? (

                    <div className="admin-chat-loading">

                        Loading messages...

                    </div>

                ) : error ? (

                    <div className="admin-chat-error">

                        {error}

                    </div>

                ) : messages.length === 0 ? (

                    <div className="admin-chat-no-messages">

                        <p>
                            No messages yet.
                        </p>

                    </div>

                ) : (

                    messages.map((message) => {

                        const isAdmin =
                            message.sender === currentUserId;


                        return (

                            <div
                                key={message.id}
                                className={
                                    `admin-message ${
                                        isAdmin
                                            ? "admin-message-sent"
                                            : "admin-message-received"
                                    }`
                                }
                            >

                                <div className="admin-message-bubble">


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
                                            className="admin-message-image"
                                        />

                                    )}


                                    {/* FILE */}

                                    {message.file && (

                                        <Link
                                            href={message.file}
                                            target="_blank"
                                            className="admin-message-file"
                                        >

                                            <FileText
                                                size={17}
                                            />

                                            Open file

                                        </Link>

                                    )}


                                    {/* FOOTER */}

                                    <div className="admin-message-footer">

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


                                        {isAdmin && (

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


            {/* ERROR */}

            {error && messages.length > 0 && (

                <div className="admin-chat-send-error">

                    {error}

                </div>

            )}


            {/* =========================
                INPUT
            ========================= */}

            <div className="admin-chat-input">

                <input

                    type="text"

                    placeholder="Type your message..."

                    value={text}

                    onChange={(e) =>
                        setText(e.target.value)
                    }

                    onKeyDown={handleKeyDown}

                    disabled={sending}

                />


                <button

                    type="button"

                    onClick={sendMessage}

                    disabled={
                        sending ||
                        !text.trim()
                    }

                >

                    {sending ? (

                        "..."

                    ) : (

                        <Send size={18} />

                    )}

                </button>

            </div>


        </section>

    );

}