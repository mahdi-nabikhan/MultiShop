"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";

import {
    Send,
    FileText,
    Check,
    CheckCheck,
} from "lucide-react";

import BACKEND_URLS from "@/utils";

import "./CustomerChatBox.css";


interface Message {

    id: number;

    conversation: number;

    sender: string;

    text: string;

    image: string | null;

    file: string | null;

    reply_to: number | null;

    is_read: boolean;

    is_edited: boolean;

    is_deleted: boolean;

    created_at: string;

    edited_at: string | null;

}


interface Props {

    conversationId: number | null;

    currentUserEmail: string;

}


export default function CustomerChatBox({

    conversationId,

    currentUserEmail,

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


            const response =
                await axios.get<Message[]>(

                    `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/list/`,

                    {
                        withCredentials: true,
                    }

                );


            setMessages(response.data);


        } catch (error) {

            console.error(
                "GET MESSAGES ERROR:",
                error
            );


            setError(
                "Failed to load messages."
            );


        } finally {

            setLoading(false);

        }

    };



    /* =========================
       LOAD CONVERSATION
    ========================= */

    useEffect(() => {

        setMessages([]);

        setError("");


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


        const interval =
            setInterval(() => {

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

            console.error(
                "SEND MESSAGE ERROR:",
                error
            );


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


            {/* =========================
                HEADER
            ========================= */}

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



            {/* =========================
                BODY
            ========================= */}

            <div className="customer-chat-body">


                {loading && messages.length === 0 ? (

                    <div className="customer-chat-loading">

                        Loading messages...

                    </div>

                ) : error && messages.length === 0 ? (

                    <div className="customer-chat-error">

                        {error}

                    </div>

                ) : messages.length === 0 ? (

                    <div className="customer-chat-no-messages">

                        <p>
                            No messages yet.
                        </p>

                    </div>

                ) : (

                    messages.map((message) => {


                        /*
                         * API sender:
                         *
                         * customer1@gmail.com
                         *
                         * manager1@gmail.com
                         *
                         */


                        const isCustomer =
                            typeof message.sender === "string" &&
                            typeof currentUserEmail === "string" &&
                            message.sender.trim().toLowerCase() ===
                            currentUserEmail.trim().toLowerCase();



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



            {/* =========================
                ERROR
            ========================= */}

            {error && messages.length > 0 && (

                <div className="customer-chat-send-error">

                    {error}

                </div>

            )}



            {/* =========================
                INPUT
            ========================= */}

            <div className="customer-chat-input">

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