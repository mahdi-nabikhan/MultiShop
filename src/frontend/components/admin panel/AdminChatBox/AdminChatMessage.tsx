import Link from "next/link";

import {
    Check,
    CheckCheck,
    FileText,
} from "lucide-react";

interface AdminChatMessageProps {
    message: {
        id: number;
        sender?: string | null;
        text?: string | null;
        image?: string | null;
        file?: string | null;
        created_at: string;
        is_read?: boolean;
    };
    isAdmin: boolean;
}

function AdminChatMessage({
    message,
    isAdmin,
}: AdminChatMessageProps) {
    return (
        <div
            className={
                isAdmin
                    ? "admin-message admin-message-sent"
                    : "admin-message admin-message-received"
            }
        >
            <div className="admin-message-bubble">
                <span className="admin-message-sender">
                    {isAdmin
                        ? "You"
                        : message.sender || "Customer"}
                </span>

                {message.text && (
                    <p>
                        {message.text}
                    </p>
                )}

                {message.image && (
                    <img
                        src={message.image}
                        alt="Message"
                        className="admin-message-image"
                    />
                )}

                {message.file && (
                    <Link
                        href={message.file}
                        target="_blank"
                        className="admin-message-file"
                    >
                        <FileText size={17} />
                        Open file
                    </Link>
                )}

                <div className="admin-message-footer">
                    <span>
                        {new Date(
                            message.created_at
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>

                    {isAdmin &&
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

export default AdminChatMessage;