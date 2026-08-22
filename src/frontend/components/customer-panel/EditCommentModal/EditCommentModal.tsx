"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save } from "lucide-react";

import { CommentProp } from "@/types/comment";
import { updateComment } from "@/services/comment.services";

import "./EditCommentModal.css";


interface Props {
    open: boolean;
    close: () => void;
    comment: CommentProp;
}


export default function EditCommentModal({
    open,
    close,
    comment,
}: Props) {

    const queryClient = useQueryClient();

    const [description, setDescription] = useState("");


    useEffect(() => {

        if (comment) {
            setDescription(comment.descriptions);
        }

    }, [comment]);


    const updateCommentMutation = useMutation({

        mutationFn: () =>
            updateComment(
                comment.id,
                description
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [
                    "comment-detail",
                    comment.id,
                ],
            });

            close();
        },

        onError: (error) => {

            console.error(
                "UPDATE COMMENT ERROR:",
                error
            );

        },

    });


    if (!open) {
        return null;
    }


    const updateCommentHandler = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        updateCommentMutation.mutate();

    };


    return (

        <div className="comment-modal-overlay">

            <div className="edit-comment-modal">


                <div className="modal-header">

                    <h2>
                        Edit Comment
                    </h2>


                    <button
                        type="button"
                        onClick={close}
                        disabled={
                            updateCommentMutation.isPending
                        }
                    >

                        <X size={22} />

                    </button>

                </div>


                <form
                    onSubmit={updateCommentHandler}
                    className="edit-comment-form"
                >


                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        required
                        disabled={
                            updateCommentMutation.isPending
                        }
                    />


                    <button
                        type="submit"
                        disabled={
                            updateCommentMutation.isPending
                        }
                    >

                        <Save size={18} />

                        {updateCommentMutation.isPending
                            ? "Updating..."
                            : "Update Comment"}

                    </button>


                </form>


            </div>

        </div>

    );
}