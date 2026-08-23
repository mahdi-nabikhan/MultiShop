"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreConversations } from "@/services/shop-admin-panel.services";
import { Conversation } from "@/types/panel-admin";
import "./ListConversation.css";
import { shopAdminQueryKeys } from "@/Lib/query-keys/shopadmin.keys";

interface Props {
    selectedConversation: number | null;
    onSelectConversation: (conversationId: number) => void;
}

export default function ConversationList({onSelectConversation,}: Props) {
    const {data: conversations = [],isLoading,isError,} = useQuery({
    queryKey: shopAdminQueryKeys.conversations(),
    queryFn: getStoreConversations,});
    

    if (isLoading) {

        return (
            <aside className="conversation-list">

                <div className="conversation-loading">
                    Loading conversations...
                </div>

            </aside>
        );

    }


    if (isError) {

        return (
            <aside className="conversation-list">

                <div className="conversation-error">
                    {isError}
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