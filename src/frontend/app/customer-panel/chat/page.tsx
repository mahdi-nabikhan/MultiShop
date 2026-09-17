
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import ConversationList from "@/components/customer-panel/ConversationList/ConversationList";

import "./chat.css";

const CustomerChatBox = dynamic(
    () =>
        import(
            "@/components/customer-panel/CustomerChatBox/CustomerChatBox"
        ),
    {
        loading: () => (
            <div className="customer-chat-empty">
                <div className="customer-chat-empty-icon">
                    💬
                </div>

                <p>
                    Loading chat...
                </p>
            </div>
        ),
    }
);

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] =
        useState<number | null>(null);

    const currentUserEmail =
        "customer1@gmail.com";

    return (
        <main className="customer-chat-page">
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
