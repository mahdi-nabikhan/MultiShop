"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import "./CommentCard.css";

import ReplyList from "../ReplyList/ReplyList";
import ReplyForm from "../ReplyForm/ReplyForm";


type User = {
    id: number;
    email: string;
};


type Comment = {
    id: number;
    descriptions: string;
    status: string;
    user: User;
    product: number;
    parent: number | null;
};


type Props = {
    comment: Comment;
    productID: number | string;
};


function CommentCard({
    comment,
    productID,
}: Props) {


    const [showReplyForm, setShowReplyForm] =
        useState(false);


    const [replyRefresh, setReplyRefresh] =
        useState(0);



    function handleReplyCreated() {

        setReplyRefresh(
            (prev: number) => prev + 1
        );

    }



    return (

        <div className="comment-card">


            {/* =========================
                Comment Header
            ========================= */}

            <div className="comment-header">


                <div className="comment-avatar">

                    {comment.user.email
                        .charAt(0)
                        .toUpperCase()}

                </div>



                <div className="comment-user">


                    <strong>
                        {comment.user.email}
                    </strong>


                    <span>
                        خریدار
                    </span>


                </div>


            </div>



            {/* =========================
                Comment Body
            ========================= */}

            <div className="comment-body">

                <p>
                    {comment.descriptions}
                </p>

            </div>



            {/* =========================
                Comment Footer
            ========================= */}

            <div className="comment-footer">


                <button

                    type="button"

                    className="reply-btn"

                    onClick={() =>
                        setShowReplyForm(
                            (prev: boolean) =>
                                !prev
                        )
                    }

                >

                    <MessageCircle size={18} />


                    {showReplyForm
                        ? "لغو پاسخ"
                        : "پاسخ"
                    }

                </button>


            </div>



            {/* =========================
                Reply Form
            ========================= */}

            {showReplyForm && (

                <ReplyForm

                    productID={productID}

                    commentID={comment.id}

                    onReplyCreated={
                        handleReplyCreated
                    }

                />

            )}



            {/* =========================
                Replies
            ========================= */}

            <ReplyList

                key={replyRefresh}

                commentID={comment.id}

            />


        </div>

    );
}


export default CommentCard;