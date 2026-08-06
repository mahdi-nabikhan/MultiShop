"use client";


import {useEffect,useState} from "react";

import axios from "axios";

import {
    MessageCircle,
    CheckCircle,
    Clock
} from "lucide-react";


import BACKEND_URLS from "@/utils";

import "./CustomerCommentList.css";





interface User {


    id:number;

    email:string;


}




interface Comment {


    id:number;

    descriptions:string;

    status:string;

    user:User;

    product:number;

    parent:number|null;


}




export default function CustomerCommentList(){



    const [comments,setComments]=useState<Comment[]>([]);

    const [loading,setLoading]=useState(true);






    const GetComments=async()=>{


        try{


            const {data}=await axios.get<Comment[]>(


                `${BACKEND_URLS}customer/api/v1/all/comments/`,


                {

                    withCredentials:true

                }


            );


            setComments(data);



        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }



    };








    useEffect(()=>{


        GetComments();


    },[]);









    if(loading){


        return (

            <div className="comments-loading">

                Loading Comments...

            </div>

        )

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


                comments.map((comment)=>(



                    <div

                        className="comment-card"

                        key={comment.id}

                    >





                        <div className="comment-icon">


                            <MessageCircle size={28}/>


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

                                    comment.status==="C"

                                    ?

                                    <>

                                    <CheckCircle size={16}/>

                                    Approved

                                    </>

                                    :

                                    <>

                                    <Clock size={16}/>

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