
"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
    Send,
    FileText,
    Check,
    CheckCheck,
} from "lucide-react";


import { getConversationMessages, sendConversationMessage } from "@/services/shop-admin-panel.services";
import { Message } from "@/types/panel-admin";
import "./AdminChatBox.css";




interface Props {

    conversationId: number | null;

    currentUserEmail: string;

}


export default function AdminChatBox({

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


            const data = await getConversationMessages(conversationId);




            setMessages(data);


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
       CONVERSATION CHANGE
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


        const cleanText =
            text.trim();


        if (!cleanText) {
            return;
        }


        try {

            setSending(true);

            setError("");


            await sendConversationMessage(
                conversationId,
                cleanText
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
       ENTER
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
       EMPTY
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
       CURRENT USER
    ========================= */

    const normalizedCurrentUser =
        (currentUserEmail || "")
            .trim()
            .toLowerCase();



    return (

        <section className="admin-chatbox">


            {/* HEADER */}

            <header className="admin-chat-header">

                <div className="admin-chat-user">

                    <div className="admin-chat-avatar">
                        C
                    </div>

                    <div>

                        <h3>
                            Customer
                        </h3>

                        <span>
                            Conversation #{conversationId}
                        </span>

                    </div>

                </div>

            </header>



            {/* BODY */}

            <div className="admin-chat-body">


                {loading && messages.length === 0 ? (

                    <div className="admin-chat-loading">
                        Loading messages...
                    </div>

                ) : error && messages.length === 0 ? (

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


                        /*
                         * API example:
                         *
                         * customer:
                         * customer1@gmail.com
                         *
                         * manager:
                         * manager1@gmail.com
                         */


                        const sender =
                            (message.sender || "")
                                .trim()
                                .toLowerCase();


                        const isAdmin =
                            sender === normalizedCurrentUser;


                        console.log(
                            "MESSAGE:",
                            message.id,
                            "SENDER:",
                            sender,
                            "CURRENT:",
                            normalizedCurrentUser,
                            "IS ADMIN:",
                            isAdmin
                        );


                        return (

                            <div

                                key={message.id}

                                className={

                                    isAdmin

                                        ? "admin-message admin-message-sent"

                                        : "admin-message admin-message-received"

                                }

                            >

                                <div className="admin-message-bubble">


                                    {/* SENDER */}

                                    <span className="admin-message-sender">

                                        {isAdmin
                                            ? "You"
                                            : message.sender || "Customer"}

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



            {/* INPUT */}

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

                    {sending
                        ? "..."
                        : <Send size={18} />}

                </button>

            </div>


        </section>

    );

}

