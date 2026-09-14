"use client";

import { Send } from "lucide-react";

interface AdminChatInputProps {
    text: string;
    isPending: boolean;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => void;
}

function AdminChatInput({
    text,
    isPending,
    onChange,
    onSend,
    onKeyDown,
}: AdminChatInputProps) {
    return (
        <div className="admin-chat-input">
            <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                onKeyDown={onKeyDown}
                disabled={isPending}
            />

            <button
                type="button"
                onClick={onSend}
                disabled={
                    isPending ||
                    !text.trim()
                }
            >
                {isPending ? (
                    "..."
                ) : (
                    <Send size={18} />
                )}
            </button>
        </div>
    );
}

export default AdminChatInput;