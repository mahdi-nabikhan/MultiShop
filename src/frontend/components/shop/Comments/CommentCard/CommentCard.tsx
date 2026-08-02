import React from "react";
import { MessageCircle } from "lucide-react";
import "./CommentCard.css";


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

};



function CommentCard({ comment }: Props) {


    return (

        <div className="comment-card">


            <div className="comment-header">


                <div className="comment-avatar">

                    {comment.user.email.charAt(0).toUpperCase()}

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



            <div className="comment-body">

                <p>
                    {comment.descriptions}
                </p>

            </div>



            <div className="comment-footer">


                <button className="reply-btn">

                    <MessageCircle size={18} />

                    پاسخ

                </button>


            </div>


        </div>

    );

}


export default CommentCard;