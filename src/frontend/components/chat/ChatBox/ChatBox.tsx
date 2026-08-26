
"use client";

import { chatQueryKeys } from "@/Lib/query-keys/chat.keys";
import { useEffect, useRef, useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createConversation,
    getConversationMessages,
    sendConversationMessage,
} from "@/services/chat.services";

import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";

import { MessageProp } from "@/types/chat";

import "./ChatBox.css";


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

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const queryClient =
        useQueryClient();


    /* =========================
       CREATE CONVERSATION
    ========================= */

    const createConversationMutation =
        useMutation({

            mutationFn: createConversation,

            onSuccess: (data) => {

                setConversationId(
                    data.conversation_id
                );

            },

        });


    /* =========================
       GET MESSAGES
    ========================= */

    const {
        data: messages = [],
        isLoading,
        isError,
    } = useQuery<MessageProp[]>({

        queryKey:
            chatQueryKeys.conversationMessages(
                conversationId as number
            ),

        queryFn: () =>
            getConversationMessages(
                conversationId as number
            ),

        enabled:
            conversationId !== null,

            refetchInterval: 3000,
            staleTime: 0,
            gcTime: 10 * 60 * 1000,

    

    });


    /* =========================
       SEND MESSAGE
    ========================= */

    const sendMessageMutation =
        useMutation({

            mutationFn: ({
                conversationId,
                text,
            }: {
                conversationId: number;
                text: string;
            }) =>
                sendConversationMessage(
                    conversationId,
                    text
                ),

            onSuccess: () => {

                queryClient.invalidateQueries({

                    queryKey:
                        chatQueryKeys.conversationMessages(
                            conversationId as number
                        ),

                });

            },

        });


    /* =========================
       CREATE / GET CONVERSATION
    ========================= */

    useEffect(() => {

        setConversationId(null);

        createConversationMutation.mutate(
            storeId
        );

    }, [storeId]);


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

    if (
        createConversationMutation.isPending ||
        isLoading
    ) {

        return (

            <section className="chatbox">

                Loading...

            </section>

        );

    }


    /* =========================
       ERROR
    ========================= */

    if (
        createConversationMutation.isError ||
        isError
    ) {

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

                onSend={(text) => {

                    if (!conversationId) {
                        return;
                    }

                    sendMessageMutation.mutate({

                        conversationId,

                        text,

                    });

                }}

            />


        </section>

    );

}

