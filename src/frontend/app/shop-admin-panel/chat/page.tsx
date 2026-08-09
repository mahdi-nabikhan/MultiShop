"use client";

import { useState } from "react";

import ConversationList from "@/components/admin panel/ListConversation/ListConversation";
import AdminChatBox from "@/components/admin panel/AdminChatBox/AdminChatBox";
import "./chat.css";

export default function ChatPage() {

    const [selectedConversation, setSelectedConversation] =
        useState<number | null>(null);


    return (

        <main className="admin-chat-page">


            {/* =========================
                CONVERSATIONS
            ========================= */}

            <aside className="admin-conversation-sidebar">

                <ConversationList
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                />

            </aside>



            {/* =========================
                CHAT
            ========================= */}

            <section className="admin-chat-content">

                {selectedConversation ? (

                    <AdminChatBox
                        conversationId={selectedConversation}
                    />

                ) : (

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

                )}

            </section>


        </main>

    );
}