"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getStoreConversations,
} from "@/services/shop-admin-panel.services";

import {
    Conversation,
} from "@/types/panel-admin";

import {
    shopAdminQueryKeys,
} from "@/Lib/query-keys/shopadmin.keys";

import Skeleton from "@/components/commen/Skeleton";
import ErrorState from "@/components/commen/ErrorState";
import EmptyState from "@/components/commen/EmptyState";

import "./ListConversation.css";


interface Props {
    selectedConversation: number | null;
    onSelectConversation: (
        conversationId: number
    ) => void;
}


export default function ConversationList({
    selectedConversation,
    onSelectConversation,
}: Props) {

    const {
        data: conversations = [],
        isLoading,
        isError,
    } = useQuery<Conversation[]>({

        queryKey:
            shopAdminQueryKeys.conversations(),

        queryFn:
            getStoreConversations,

    });


    if (isLoading) {

        return (

            <aside className="conversation-list">

                <Skeleton count={5} />

            </aside>

        );

    }


    if (isError) {

        return (

            <aside className="conversation-list">

                <ErrorState
                    message="Failed to load conversations."
                />

            </aside>

        );

    }


    if (conversations.length === 0) {

        return (

            <aside className="conversation-list">

                <div className="conversation-list-header">

                    <div>

                        <h2>
                            Messages
                        </h2>

                        <span>
                            0 conversations
                        </span>

                    </div>

                </div>


                <div className="conversation-items">

                    <EmptyState
                        message="No conversations yet."
                    />

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

                        {
                            conversations.length
                        } conversations

                    </span>

                </div>

            </div>


            <div className="conversation-items">

                {
                    conversations.map(
                        (conversation) => (

                            <button
                                key={
                                    conversation.id
                                }
                                type="button"
                                className={
                                    `conversation-item ${
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

                                <div className="conversation-avatar">

                                    {
                                        `C${conversation.customer}`
                                    }

                                </div>


                                <div className="conversation-info">

                                    <div className="conversation-top">

                                        <strong>

                                            Customer #
                                            {
                                                conversation.customer
                                            }

                                        </strong>


                                        <span>

                                            #
                                            {
                                                conversation.id
                                            }

                                        </span>

                                    </div>


                                    <div className="conversation-bottom">

                                        <span>

                                            {
                                                conversation.status
                                            }

                                        </span>

                                    </div>

                                </div>

                            </button>

                        )
                    )
                }

            </div>

        </aside>

    );

}