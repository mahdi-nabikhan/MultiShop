"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteComment } from "@/services/comment.services"; 
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";

import "./DeleteCommentModal.css";


interface Props {
    open: boolean;
    close: () => void;
    commentId: number;
}


export default function DeleteCommentModal({

    open,

    close,

    commentId,

}: Props) {


    const queryClient =
        useQueryClient();


    const {
        mutate: DeleteComment,
        isPending,
    } = useMutation({

        mutationFn: () =>
            deleteComment(commentId),

        onSuccess: async () => {

            await queryClient.invalidateQueries({

                queryKey:
                    customerQueryKeys.comments(),

            });


            await queryClient.invalidateQueries({

                queryKey: [
                    "comment-detail",
                    commentId,
                ],

            });


            close();

        },

        onError: (error) => {

            console.error(
                "DELETE COMMENT ERROR:",
                error
            );

        },

    });


    if (!open) {

        return null;

    }


    return (

        <div className="delete-modal-overlay">


            <div className="delete-comment-modal">


                <h2>

                    Delete Comment?

                </h2>


                <p>

                    Are you sure you want to delete this comment?

                    This action cannot be undone.

                </p>


                <div className="delete-actions">


                    <button

                        className="cancel-delete"

                        onClick={close}

                        disabled={isPending}

                    >

                        Cancel

                    </button>


                    <button

                        className="confirm-delete"

                        onClick={() =>
                            DeleteComment()
                        }

                        disabled={isPending}

                    >

                        {

                            isPending

                                ? "Deleting..."

                                : "Delete"

                        }

                    </button>


                </div>


            </div>


        </div>

    );

}