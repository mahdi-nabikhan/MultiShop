"use client";

import { useState } from "react";
import axios from "axios";

import BACKEND_URLS from "@/utils";

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


        if (!description.trim()) {

            setError("Reply cannot be empty.");

            return;

        }


        try {

            setLoading(true);

            setError("");

            setSuccess("");


            await axios.post(

                `${BACKEND_URLS}customer/api/v1/add/get/comment/repaly/${commentID}/`,

                {
                    descriptions: description,
                    product: productID,
                    parent: commentID,
                },

                {
                    withCredentials: true,
                }

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