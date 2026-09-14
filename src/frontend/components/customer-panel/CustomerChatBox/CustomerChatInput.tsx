"use client";

import { Send } from "lucide-react";

interface CustomerChatInputProps {
    text: string;
    isPending: boolean;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => void;
}

function CustomerChatInput({
    text,
    isPending,
    onChange,
    onSend,
    onKeyDown,
}: CustomerChatInputProps) {
    return (
        <div className="customer-chat-input">
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

export default CustomerChatInput;