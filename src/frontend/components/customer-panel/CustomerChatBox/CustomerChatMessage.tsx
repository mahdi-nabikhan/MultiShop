
import Link from "next/link";

import {
    Check,
    CheckCheck,
    FileText,
} from "lucide-react";

import type { Message } from "@/types/chat";

interface CustomerChatMessageProps {
    message: Message;
    isCustomer: boolean;
}

function CustomerChatMessage({
    message,
    isCustomer,
}: CustomerChatMessageProps) {
    return (
        <div
            className={
                `customer-message ${
                    isCustomer
                        ? "customer-message-sent"
                        : "customer-message-received"
                }`
            }
        >
            <div className="customer-message-bubble">

                {/* SENDER */}

                <span className="customer-message-sender">
                    {isCustomer
                        ? "You"
                        : message.sender}
                </span>

                {/* TEXT */}

                {message.text && (
                    <p>
                        {message.text}
                    </p>
                )}

                {/* IMAGE */}

                {message.image && (
                    <img
                        src={message.image}
                        alt="Message"
                        className="customer-message-image"
                    />
                )}

                {/* FILE */}

                {message.file && (
                    <Link
                        href={message.file}
                        target="_blank"
                        className="customer-message-file"
                    >
                        <FileText size={17} />
                        Open file
                    </Link>
                )}

                {/* FOOTER */}

                <div className="customer-message-footer">
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

                    {isCustomer &&
                        (message.is_read ? (
                            <CheckCheck size={15} />
                        ) : (
                            <Check size={15} />
                        ))}
                </div>

            </div>
        </div>
    );
}

export default CustomerChatMessage;

