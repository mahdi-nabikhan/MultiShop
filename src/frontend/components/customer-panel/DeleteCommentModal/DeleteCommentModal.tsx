"use client";


import axios from "axios";

import {
    X,
    Trash
} from "lucide-react";


import BACKEND_URLS from "@/utils";

import "./DeleteCommentModal.css";





interface Props {


    open:boolean;

    close:()=>void;

    commentId:number;


}





export default function DeleteCommentModal({

    open,

    close,

    commentId


}:Props){





    if(!open){

        return null;

    }







    const DeleteComment=async()=>{


        try{


            await axios.delete(


                `${BACKEND_URLS}customer/api/v1/detail/comment/${commentId}/`,


                {

                    withCredentials:true

                }


            );



            window.location.href="/customer-panel/comments";



        }


        catch(error){


            console.log(error);


        }


    };








    return (


        <div className="delete-comment-overlay">





            <div className="delete-comment-modal">





                <div className="delete-icon">


                    <Trash size={35}/>


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

                        onClick={DeleteComment}

                    >

                        Delete

                    </button>



                </div>





            </div>





        </div>


    );



}