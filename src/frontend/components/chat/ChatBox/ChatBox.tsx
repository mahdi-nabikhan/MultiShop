
"use client";

import { useEffect, useRef } from "react";

import useChat from "@/hooks/chat/useChat";

import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";

import "./ChatBox.css";

interface Props {
    storeId: number;
    currentUserEmail: string;
}

export default function ChatBox({
    storeId,
    currentUserEmail,
}: Props) {

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const {
        messages,
        isLoading,
        isError,
        sendMessage,
    } = useChat(storeId);


    /* =========================
       AUTO SCROLL
    ========================= */

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    /* =========================
       LOADING
    ========================= */

    if (isLoading) {

        return (
            <section className="chatbox">
                Loading...
            </section>
        );

    }


    /* =========================
       ERROR
    ========================= */

    if (isError) {

        return (
            <section className="chatbox">
                Failed to load chat.
            </section>
        );

    }


    /* =========================
       RENDER
    ========================= */

    return (

        <section className="chatbox">

            {/* HEADER */}

            <div className="chat-header">

                <div className="seller-info">

                    <div className="avatar">
                        S
                    </div>

                    <div>

                        <h3>
                            Store Chat
                        </h3>

                        <span>
                            Online
                        </span>

                    </div>

                </div>

            </div>


            {/* MESSAGES */}

            <div className="chat-body">

                {messages.map((message) => {

                    const isCurrentUser =
                        message.sender
                            ?.trim()
                            .toLowerCase() ===
                        currentUserEmail
                            ?.trim()
                            .toLowerCase();

                    return (

                        <ChatMessage
                            key={message.id}
                            text={message.text || ""}
                            image={message.image}
                            file={message.file}
                            sender={
                                isCurrentUser
                                    ? "customer"
                                    : "seller"
                            }
                            createdAt={message.created_at}
                            isRead={message.is_read}
                        />

                    );

                })}

                <div ref={messagesEndRef} />

            </div>


            {/* INPUT */}

            <ChatInput
                onSend={(text) => {
                    sendMessage(text);
                }}
            />

        </section>

    );
}
