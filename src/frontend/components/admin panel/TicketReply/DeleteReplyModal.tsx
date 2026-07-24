"use client";

import { useState } from "react";
import axios from "axios";
import BACKEND_URLS from "@/utils";

interface Props {
    open: boolean;
    onClose: () => void;
    replyId: number;
    refreshReplies: () => void;
}

export default function DeleteReplyModal({
    open,
    onClose,
    replyId,
    refreshReplies,
}: Props) {

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const deleteReply = async () => {

        try {

            setLoading(true);

            await axios.delete(

                `${BACKEND_URLS}YOUR_DELETE_REPLY_API/${replyId}/`,

                {
                    withCredentials: true,
                }

            );

            refreshReplies();

            onClose();

        } catch (err) {

            console.log(err);

            alert("Failed to delete reply.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="reply-modal delete-modal">

                <h2>

                    Delete Reply

                </h2>

                <p>

                    Are you sure you want to delete this reply?

                </p>

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="delete-btn"

                        disabled={loading}

                        onClick={deleteReply}

                    >

                        {

                            loading

                                ? "Deleting..."

                                : "Delete"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}