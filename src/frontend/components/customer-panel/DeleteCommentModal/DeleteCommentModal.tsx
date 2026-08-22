"use client";

import { Trash } from "lucide-react";
import "./DeleteCommentModal.css";
import { deleteComment } from "@/services/comment.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
    open: boolean;
    close: () => void;
    commentId: number;
}





export default function DeleteCommentModal({ open, close, commentId }: Props) {



    const queryClient = useQueryClient();

    const {
        mutate: handleDeleteComment,
        isPending,
    } = useMutation({
        mutationFn: () => deleteComment(commentId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["customer-comments"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["comment-detail", commentId],
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


        <div className="delete-comment-overlay">





            <div className="delete-comment-modal">





                <div className="delete-icon">


                    <Trash size={35} />


                </div>





                <h2>

                    Delete Comment?

                </h2>




                <p>

                    Are you sure you want to delete this comment?

                </p>







                <div className="delete-buttons">



                    <button

                        className="cancel-btn"

                        onClick={close}

                    >

                        Cancel

                    </button>






                    <button
                        className="delete-btn"
                        onClick={() => handleDeleteComment()}
                    >
                        Delete
                    </button>



                </div>





            </div>





        </div>


    );



}