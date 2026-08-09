"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

import "./ConversationList.css";

interface Conversation {
    id: number;
    customer: number;
    customer_name: string;
    store: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    selectedConversation: number | null;
    onSelectConversation: (conversationId: number) => void;
}

export default function ConversationList({
    selectedConversation,
    onSelectConversation,
}: Props) {

    const [conversations, setConversations] =
        useState<Conversation[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const getConversations = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await axios.get<Conversation[]>(

                    `${BACKEND_URLS}dashboard/api/v1/list/customer/conversation/`,

                    {
                        withCredentials: true,
                    }

                );

            setConversations(response.data);

        } catch (error) {

            console.error(
                "GET CUSTOMER CONVERSATIONS ERROR:",
                error
            );

            setError(
                "Failed to load conversations."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getConversations();

    }, []);


    if (loading) {

        return (

            <aside className="customer-conversation-list">

                <div className="customer-conversation-loading">

                    Loading conversations...

                </div>

            </aside>

        );

    }


    if (error) {

        return (

            <aside className="customer-conversation-list">

                <div className="customer-conversation-error">

                    {error}

                </div>

            </aside>

        );

    }


    return (

        <aside className="customer-conversation-list">

            <div className="customer-conversation-header">

                <div>

                    <h2>
                        Messages
                    </h2>

                    <span>
                        {conversations.length} conversations
                    </span>

                </div>

            </div>


            <div className="customer-conversation-items">

                {conversations.length === 0 ? (

                    <div className="customer-empty-conversations">

                        <p>
                            No conversations yet.
                        </p>

                    </div>

                ) : (

                    conversations.map((conversation) => (

                        <button

                            key={conversation.id}

                            type="button"

                            className={
                                `customer-conversation-item ${
                                    selectedConversation === conversation.id
                                        ? "active"
                                        : ""
                                }`
                            }

                            onClick={() =>
                                onSelectConversation(
                                    conversation.id
                                )
                            }

                        >

                            <div className="customer-conversation-avatar">

                                {conversation.customer_name
                                    ?.charAt(0)
                                    .toUpperCase() || "C"}

                            </div>


                            <div className="customer-conversation-info">

                                <div className="customer-conversation-top">

                                    <strong>

                                        Store #{conversation.store}

                                    </strong>

                                    <span>

                                        #{conversation.id}

                                    </span>

                                </div>


                                <div className="customer-conversation-bottom">

                                    <span
                                        className={
                                            `conversation-status ${conversation.status}`
                                        }
                                    >

                                        {conversation.status}

                                    </span>

                                </div>

                            </div>

                        </button>

                    ))

                )}

            </div>

        </aside>

    );

}