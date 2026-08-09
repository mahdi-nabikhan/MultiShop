"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

import "./ListConversation.css";

interface Conversation {
    id: number;
    store: number;
    customer: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}

interface Props {
    selectedConversation: number | null;
    onSelectConversation: (conversationId: number) => void;
}

export default function ConversationList({
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

            const response = await axios.get<Conversation[]>(
                `${BACKEND_URLS}dashboard/api/v1/list/store/conversations/`,
                {
                    withCredentials: true,
                }
            );

            setConversations(response.data);

        } catch (error) {

            console.error(error);

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
            <aside className="conversation-list">

                <div className="conversation-loading">
                    Loading conversations...
                </div>

            </aside>
        );

    }


    if (error) {

        return (
            <aside className="conversation-list">

                <div className="conversation-error">
                    {error}
                </div>

            </aside>
        );

    }


    return (

        <aside className="conversation-list">

            <div className="conversation-list-header">

                <div>

                    <h2>
                        Messages
                    </h2>

                    <span>
                        {conversations.length} conversations
                    </span>

                </div>

            </div>


            <div className="conversation-items">

                {conversations.length === 0 ? (

                    <div className="empty-conversations">

                        <p>
                            No conversations yet.
                        </p>

                    </div>

                ) : (

                    conversations.map((conversation) => (

                        <button
                            key={conversation.id}
                            type="button"
                            className="conversation-item"
                            onClick={() =>
                                onSelectConversation(
                                    conversation.id
                                )
                            }
                        >

                            <div className="conversation-avatar">

                                C

                            </div>


                            <div className="conversation-info">

                                <div className="conversation-top">

                                    <strong>
                                        Customer #{conversation.customer}
                                    </strong>

                                    <span>
                                        #{conversation.id}
                                    </span>

                                </div>


                                <div className="conversation-bottom">

                                    <span>
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