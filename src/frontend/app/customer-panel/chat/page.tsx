
"use client";

import { useState } from "react";

import ConversationList from "@/components/customer-panel/ConversationList/ConversationList";
import CustomerChatBox from "@/components/customer-panel/CustomerChatBox/CustomerChatBox";

import "./chat.css";


export default function ChatPage() {

    const [selectedConversation, setSelectedConversation] =
        useState<number | null>(null);

    const currentUserEmail =
        "customer1@gmail.com";


    return (

        <main className="customer-chat-page">


            {/* =================================
                CONVERSATION LIST
            ================================= */}

            <aside className="customer-conversation-sidebar">

                <ConversationList

                    selectedConversation={
                        selectedConversation
                    }

                    onSelectConversation={
                        setSelectedConversation
                    }

                />

            </aside>



            {/* =================================
                CHAT
            ================================= */}

            <section className="customer-chat-content">

                {selectedConversation ? (

                    <CustomerChatBox

                        conversationId={
                            selectedConversation
                        }

                        currentUserEmail={
                            currentUserEmail
                        }

                    />

                ) : (

                    <div className="customer-chat-empty">

                        <div className="customer-chat-empty-icon">
                            💬
                        </div>


                        <h2>
                            Select a conversation
                        </h2>


                        <p>
                            Select a conversation from
                            the list to continue chatting.
                        </p>

                    </div>

                )}

            </section>


        </main>

    );

}

