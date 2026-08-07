"use client";

import { useState, KeyboardEvent } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

import "./ChatInput.css";

interface Props {
    onSend: (text: string) => Promise<void> | void;
}

export default function ChatInput({ onSend }: Props) {

    const [text, setText] = useState("");

    const [loading, setLoading] = useState(false);


    const HandleSend = async () => {

        if (!text.trim()) return;

        try {

            setLoading(true);

            await onSend(text);

            setText("");

        }

        finally {

            setLoading(false);

        }

    };


    const HandleEnter = async (
        e: KeyboardEvent<HTMLInputElement>
    ) => {

        if (e.key === "Enter") {

            e.preventDefault();

            await HandleSend();

        }

    };


    return (

        <div className="chat-input-container">


            <button
                className="chat-icon-btn"
                type="button"
            >

                <Smile size={20} />

            </button>


            <button
                className="chat-icon-btn"
                type="button"
            >

                <Paperclip size={20} />

            </button>



            <input

                type="text"

                placeholder="Type your message..."

                value={text}

                onChange={(e) => setText(e.target.value)}

                onKeyDown={HandleEnter}

            />



            <button

                className="chat-send-btn"

                onClick={HandleSend}

                disabled={loading}

            >

                <Send size={18} />

            </button>


        </div>

    );

}