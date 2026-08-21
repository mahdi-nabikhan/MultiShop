"use client";

import { Trash } from "lucide-react";
import "./DeleteCommentModal.css";
import { deleteComment } from "@/services/comment.services";


interface Props {
    open: boolean;
    close: () => void;
    commentId: number;
}





export default function DeleteCommentModal({ open, close, commentId }: Props) {
    const handleDeleteComment = async () => {

        try {

            await deleteComment(commentId);

            window.location.href =
                "/customer-panel/comments";

        } catch (error) {

            console.error(
                "DELETE COMMENT ERROR:",
                error
            );

        }

    };

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

                        onClick={handleDeleteComment}

                    >

                        Delete

                    </button>



                </div>





            </div>





        </div>


    );



}