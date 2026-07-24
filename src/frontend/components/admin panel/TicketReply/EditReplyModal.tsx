"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

interface Reply {
    id: number;
    content: string;
    created: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    reply: Reply;
    refreshReplies: () => void;
}

export default function EditReplyModal({
    open,
    onClose,
    reply,
    refreshReplies,
}: Props) {

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (reply) {

            setContent(reply.content);

        }

    }, [reply]);

    if (!open) return null;

    const updateReply = async () => {

        if (!content.trim()) {

            alert("Content is required.");

            return;

        }

        try {

            setLoading(true);

            await axios.patch(

                `${BACKEND_URLS}YOUR_PATCH_REPLY_API/${reply.id}/`,

                {
                    content,
                },

                {
                    withCredentials: true,
                }

            );

            refreshReplies();

            onClose();

        } catch (err) {

            console.log(err);

            alert("Failed to update reply.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="reply-modal">

                <h2>

                    Edit Reply

                </h2>

                <textarea

                    rows={7}

                    value={content}

                    onChange={(e) => setContent(e.target.value)}

                />

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={updateReply}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Updating..."

                                : "Update Reply"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}