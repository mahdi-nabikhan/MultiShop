"use client";


import { useQuery } from "@tanstack/react-query";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys";
import { getCustomerComments } from "@/services/cutomer-panel.services";
import { Comment } from "@/types/comment";
import {
    MessageCircle,
    CheckCircle,
    Clock
} from "lucide-react";
import "./CustomerCommentList.css";




export default function CustomerCommentList() {
    const {
        data: comments = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: customerQueryKeys.comments(),
        queryFn: getCustomerComments,
    });

    if (isLoading) {


        return (

            <div className="comments-loading">

                Loading Comments...

            </div>

        )

    }

    if (isError) {
        return (
            <div className="comments-loading">
                Failed to load comments.
            </div>
        );
    }






    return (


        <section className="customer-comments">





            <div className="comments-header">


                <h2>

                    My Comments

                </h2>


                <p>

                    Manage your product reviews

                </p>


            </div>







            <div className="comments-list">



                {


                    comments.map((comment) => (



                        <div

                            className="comment-card"

                            key={comment.id}

                        >





                            <div className="comment-icon">


                                <MessageCircle size={28} />


                            </div>






                            <div className="comment-content">


                                <h3>

                                    Product #{comment.product}

                                </h3>




                                <p>

                                    {comment.descriptions}

                                </p>






                                <div className="comment-meta">



                                    <span>


                                        {

                                            comment.status === "C"

                                                ?

                                                <>

                                                    <CheckCircle size={16} />

                                                    Approved

                                                </>

                                                :

                                                <>

                                                    <Clock size={16} />

                                                    Pending

                                                </>

                                        }


                                    </span>




                                    <small>

                                        {comment.user.email}

                                    </small>



                                </div>



                            </div>




                        </div>



                    ))


                }



            </div>





        </section>


    );



}