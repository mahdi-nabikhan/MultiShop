
"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import {
    Send,
    FileText,
    Check,
    CheckCheck,
} from "lucide-react";

import useConversationMessages from "@/hooks/customer/useConversationMessages";
import useSendConversationMessage from "@/hooks/admin-panel/useSendConversationMessage";
import "./AdminChatBox.css";


interface Props {
    conversationId: number | null;
    currentUserEmail: string;
}


export default function AdminChatBox({
    conversationId,
    currentUserEmail,
}: Props) {


    // ==========================================
    // State
    // ==========================================

    const [text, setText] = useState("");

    const messagesEndRef =
        useRef<HTMLDivElement>(null);


    // ==========================================
    // Get Messages
    // ==========================================

    const {
        data: messages = [],
        isLoading: loading,
        isError,
    } = useConversationMessages(
        conversationId
    );


    const error = isError
        ? "Failed to load messages."
        : "";


    // ==========================================
    // Send Message
    // ==========================================

    const sendMessageMutation =
        useSendConversationMessage();


    // ==========================================
    // Send Message
    // ==========================================

    const sendMessage = () => {

        if (!conversationId) {
            return;
        }


        const cleanText =
            text.trim();


        if (!cleanText) {
            return;
        }


        sendMessageMutation.mutate({
            conversationId,
            text: cleanText,
        });


        setText("");
    };


    // ==========================================
    // Enter
    // ==========================================

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // ==========================================
    // Empty
    // ==========================================

    if (!conversationId) {

        return (

            <section className="admin-chatbox empty">

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

            </section>

        );

    }


    // ==========================================
    // Current User
    // ==========================================

    const normalizedCurrentUser =
        (currentUserEmail || "")
            .trim()
            .toLowerCase();


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="admin-chatbox">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="admin-chat-header">

                <div className="admin-chat-user">

                    <div className="admin-chat-avatar">
                        C
                    </div>

                    <div>

                        <h3>
                            Customer
                        </h3>

                        <span>
                            Conversation #{conversationId}
                        </span>

                    </div>

                </div>

            </header>


            {/* ==================================
                BODY
            ================================== */}

            <div className="admin-chat-body">


                {loading && messages.length === 0 ? (

                    <div className="admin-chat-loading">
                        Loading messages...
                    </div>

                ) : error && messages.length === 0 ? (

                    <div className="admin-chat-error">
                        {error}
                    </div>

                ) : messages.length === 0 ? (

                    <div className="admin-chat-no-messages">

                        <p>
                            No messages yet.
                        </p>

                    </div>

                ) : (

                    messages.map((message) => {


                        // ==================================
                        // Sender
                        // ==================================

                        const sender =
                            (message.sender || "")
                                .trim()
                                .toLowerCase();


                        const isAdmin =
                            sender ===
                            normalizedCurrentUser;


                        return (

                            <div

                                key={message.id}

                                className={
                                    isAdmin
                                        ? "admin-message admin-message-sent"
                                        : "admin-message admin-message-received"
                                }

                            >

                                <div className="admin-message-bubble">


                                    {/* ==========================
                                        SENDER
                                    ========================== */}

                                    <span className="admin-message-sender">

                                        {isAdmin
                                            ? "You"
                                            : message.sender ||
                                              "Customer"}

                                    </span>


                                    {/* ==========================
                                        TEXT
                                    ========================== */}

                                    {message.text && (

                                        <p>
                                            {message.text}
                                        </p>

                                    )}


                                    {/* ==========================
                                        IMAGE
                                    ========================== */}

                                    {message.image && (

                                        <img

                                            src={message.image}

                                            alt="Message"

                                            className="admin-message-image"

                                        />

                                    )}


                                    {/* ==========================
                                        FILE
                                    ========================== */}

                                    {message.file && (

                                        <Link

                                            href={message.file}

                                            target="_blank"

                                            className="admin-message-file"

                                        >

                                            <FileText
                                                size={17}
                                            />

                                            Open file

                                        </Link>

                                    )}


                                    {/* ==========================
                                        FOOTER
                                    ========================== */}

                                    <div className="admin-message-footer">

                                        <span>

                                            {new Date(
                                                message.created_at
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}

                                        </span>


                                        {isAdmin && (

                                            message.is_read ? (

                                                <CheckCheck
                                                    size={15}
                                                />

                                            ) : (

                                                <Check
                                                    size={15}
                                                />

                                            )

                                        )}

                                    </div>


                                </div>

                            </div>

                        );

                    })

                )}


                <div
                    ref={messagesEndRef}
                />

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && messages.length > 0 && (

                <div className="admin-chat-send-error">

                    {error}

                </div>

            )}


            {/* ==================================
                INPUT
            ================================== */}

            <div className="admin-chat-input">

                <input

                    type="text"

                    placeholder="Type your message..."

                    value={text}

                    onChange={(e) =>
                        setText(e.target.value)
                    }

                    onKeyDown={handleKeyDown}

                    disabled={
                        sendMessageMutation.isPending
                    }

                />


                <button

                    type="button"

                    onClick={sendMessage}

                    disabled={
                        sendMessageMutation.isPending ||
                        !text.trim()
                    }

                >

                    {sendMessageMutation.isPending

                        ? "..."

                        : <Send size={18} />

                    }

                </button>

            </div>


        </section>

    );

}

