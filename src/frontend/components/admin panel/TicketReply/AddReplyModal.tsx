"use client";

import { useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

interface Props {
    open: boolean;
    onClose: () => void;
    ticketId: number;
    refreshReplies: () => void;
}

export default function AddReplyModal({
    open,
    onClose,
    ticketId,
    refreshReplies,
}: Props) {

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const submitHandler = async () => {

        if (!content.trim()) {

            alert("Content is required.");

            return;

        }

        try {

            setLoading(true);

            await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/replay/ticket/${ticketId}/`,

                {
                    content,
                },

                {
                    withCredentials: true,
                }

            );

            setContent("");

            refreshReplies();

            onClose();

        } catch (err) {

            console.log(err);

            alert("Failed to create reply.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="reply-modal">

                <h2>

                    Add Reply

                </h2>

                <textarea

                    rows={7}

                    placeholder="Write your reply..."

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

                        disabled={loading}

                        onClick={submitHandler}

                    >

                        {

                            loading

                                ? "Saving..."

                                : "Add Reply"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}