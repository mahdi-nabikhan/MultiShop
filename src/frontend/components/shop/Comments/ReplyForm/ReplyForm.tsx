"use client";

import { useState } from "react";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

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

    const queryClient = useQueryClient();

    const [description, setDescription] =
        useState("");


    const replyMutation = useMutation({

        mutationFn: () =>
            createCommentReply(
                commentID,
                productID,
                description.trim()
            ),

        onSuccess: () => {

            setDescription("");

            queryClient.invalidateQueries({
                queryKey: [
                    "product-comments",
                    productID,
                ],
            });

            onReplyCreated?.();

        },

        onError: (error: any) => {

            console.error(error);

        },

    });


    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        const trimmedDescription =
            description.trim();


        if (!trimmedDescription) {
            return;
        }


        if (trimmedDescription.length < 3) {
            return;
        }


        if (trimmedDescription.length > 1000) {
            return;
        }


        replyMutation.mutate();

    };


    return (

        <form
            className="reply-form"
            onSubmit={handleSubmit}
        >

            <textarea

                value={description}

                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }

                placeholder="Write a reply..."

                rows={3}

            />


            {replyMutation.isError && (

                <p className="reply-error">

                    Failed to add reply.

                </p>

            )}


            {replyMutation.isSuccess && (

                <p className="reply-success">

                    Reply added successfully.

                </p>

            )}


            <button

                type="submit"

                disabled={
                    replyMutation.isPending
                }

            >

                {replyMutation.isPending
                    ? "Sending..."
                    : "Reply"
                }

            </button>


        </form>

    );

}