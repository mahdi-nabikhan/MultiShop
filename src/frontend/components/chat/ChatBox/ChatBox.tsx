"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";

import "./ChatBox.css";

interface Message {
    id: number;
    conversation: number;
    text: string;
    image: string | null;
    file: string | null;
    created_at: string;
    sender: string;
    is_read: boolean;
}

interface Props {
    storeId: number;
    currentUserEmail: string;
}

export default function ChatBox({
    storeId,
    currentUserEmail,
}: Props) {

    const [conversationId, setConversationId] =
        useState<number | null>(null);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(true);

    const messagesEndRef =
        useRef<HTMLDivElement>(null);


    /* =========================
       CREATE / GET CONVERSATION
    ========================= */

    const CreateConversation = async () => {

        try {

            console.log("STORE ID:", storeId);
            console.log("STORE ID TYPE:", typeof storeId);

            const { data } = await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/chat/conversations/`,

                {
                    store: storeId,
                },

                {
                    withCredentials: true,
                }

            );

            setConversationId(
                data.conversation_id
            );

        } catch (error: any) {

            console.log(
                "CREATE CONVERSATION STATUS:",
                error.response?.status
            );

            console.log(
                "CREATE CONVERSATION DATA:",
                error.response?.data
            );

            console.log(
                "CREATE CONVERSATION ERROR:",
                error
            );

        }

    };


    /* =========================
       GET MESSAGES
    ========================= */

    const GetMessages = async (
        id: number
    ) => {

        try {

            const { data } = await axios.get(

                `${BACKEND_URLS}dashboard/api/v1/conversations/${id}/messages/list/`,

                {
                    withCredentials: true,
                }

            );

            setMessages(data);

        } catch (error) {

            console.log(
                "GET MESSAGES ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================
       SEND MESSAGE
    ========================= */

    const SendMessage = async (
        text: string
    ) => {

        if (!conversationId) {
            return;
        }

        try {

            await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/`,

                {
                    text,
                },

                {
                    withCredentials: true,
                }

            );

            await GetMessages(
                conversationId
            );

        } catch (error) {

            console.log(
                "SEND MESSAGE ERROR:",
                error
            );

        }

    };


    /* =========================
       CREATE CONVERSATION
    ========================= */

    useEffect(() => {

        CreateConversation();

    }, [storeId]);


    /* =========================
       LOAD MESSAGES
    ========================= */

    useEffect(() => {

        if (conversationId) {

            GetMessages(
                conversationId
            );

        }

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
       AUTO REFRESH
    ========================= */

    useEffect(() => {

        if (!conversationId) {
            return;
        }

        const interval =
            setInterval(() => {

                GetMessages(
                    conversationId
                );

            }, 3000);

        return () => {

            clearInterval(interval);

        };

    }, [conversationId]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <section className="chatbox">

                Loading...

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

                    /*
                     * API sender:
                     *
                     * customer1@gmail.com
                     * manager1@gmail.com
                     *
                     * currentUserEmail:
                     *
                     * customer1@gmail.com
                     */

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

                            text={
                                message.text || ""
                            }

                            image={
                                message.image
                            }

                            file={
                                message.file
                            }

                            sender={

                                isCurrentUser

                                    ? "customer"

                                    : "seller"

                            }

                            createdAt={
                                message.created_at
                            }

                            isRead={
                                message.is_read
                            }

                        />

                    );

                })}


                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* INPUT */}

            <ChatInput
                onSend={SendMessage}
            />


        </section>

    );

}