"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {MessageCircle,Edit,Trash} from "lucide-react";
import { getCommentDetail } from "@/services/cutomer-panel.services";
import { Comment } from "@/types/comment";

import EditCommentModal from "../EditCommentModal/EditCommentModal";

import DeleteCommentModal from "../DeleteCommentModal/DeleteCommentModal";


import "./CustomerCommentDetail.css";










interface Props {


    commentId: number;


}





export default function CustomerCommentDetail({

    commentId

}: Props) {




    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const {
        data: comment,
        isLoading,
        isError,
    } = useQuery<Comment>({
        queryKey: ["comment-detail", commentId],
        queryFn: () => getCommentDetail(commentId),
        enabled: !!commentId,
    });


    if (isLoading) {
        return <div>
            Loading...
        </div>;
    }

    if (isError) {
        return <div>
            Failed to load comment.
        </div>;
    }

        if (!comment) {
        return <div>Comment not found.</div>;
    }


    return (

        <section className="comment-detail">

            <div className="comment-detail-header">

                <h2>
                    Comment Details
                </h2>

                <div>

                    <button

                        className="edit-btn"

                        onClick={() => setOpenEdit(true)}

                    >

                        <Edit size={18} />

                        Edit

                    </button>




                    <button

                        className="delete-btn"

                        onClick={() => setOpenDelete(true)}

                    >

                        <Trash size={18} />

                        Delete

                    </button>


                </div>



            </div>







            <div className="comment-detail-card">



                <div className="comment-detail-icon">

                    <MessageCircle size={40} />

                </div>





                <div>


                    <h3>

                        Product #{comment.product}

                    </h3>



                    <p>

                        {comment.descriptions}

                    </p>




                    <div className="comment-status">


                        Status:

                        {

                            comment.status === "C"

                                ?

                                " Approved"

                                :

                                " Pending"

                        }


                    </div>



                    <span>

                        {comment.user.email}

                    </span>



                </div>





            </div>







            <EditCommentModal
                open={openEdit}
                close={() => setOpenEdit(false)}
                comment={comment}


            />





            <DeleteCommentModal

                open={openDelete}

                close={() => setOpenDelete(false)}

                commentId={comment.id}

            />







        </section>


    );


}