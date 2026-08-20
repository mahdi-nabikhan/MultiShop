"use client";

import { useState } from "react";
import { createCommentReply } from "@/services/comment.services";

interface Props {
    productID: number | string;
    commentID: number;
    onReplyCreated?: () => void;
}

export default function ReplyForm({
    productID,
    commentID,
    onReplyCreated,
}: Props) {

    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");




    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        const trimmedDescription = description.trim();

        setError("");
        setSuccess("");

        if (!trimmedDescription) {
            setError("Reply cannot be empty.");
            return;
        }

        if (trimmedDescription.length < 3) {
            setError("Reply must be at least 3 characters.");
            return;
        }

        if (trimmedDescription.length > 1000) {
            setError("Reply cannot exceed 1000 characters.");
            return;
        }

        try {
            setLoading(true);

            await createCommentReply(
                commentID,
                productID,
                trimmedDescription
            );

            setDescription("");

            setSuccess(
                "Reply added successfully."
            );

            if (onReplyCreated) {
                onReplyCreated();
            }

        } catch (error: any) {

            console.error(error);

            if (error.response?.data) {

                setError(
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                setError(
                    "Failed to add reply."
                );

            }

        } finally {

            setLoading(false);

        }
    }


    return (

        <form
            className="reply-form"
            onSubmit={handleSubmit}
        >

            <textarea
                value={description}
                onChange={(e) =>
                    setDescription(e.target.value)
                }
                placeholder="Write a reply..."
                rows={3}
            />


            {error && (

                <p className="reply-error">
                    {error}
                </p>

            )}


            {success && (

                <p className="reply-success">
                    {success}
                </p>

            )}


            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? "Sending..."
                    : "Reply"
                }

            </button>

        </form>

    );

}