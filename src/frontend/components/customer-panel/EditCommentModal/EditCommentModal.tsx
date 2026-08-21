"use client";


import {useEffect,useState} from "react";
import {X,Save} from "lucide-react";
import { CommentProp } from "@/types/comment";
import "./EditCommentModal.css";
import { updateComment } from "@/services/comment.services";






interface Props {


    open:boolean;

    close:()=>void;

    comment:CommentProp;

    refresh:()=>void;


}




export default function EditCommentModal({

    open,

    close,

    comment,

    refresh


}:Props){



    const [description,setDescription]=useState("");




    useEffect(()=>{


        if(comment){

            setDescription(comment.descriptions);

        }


    },[comment]);







    if(!open){

        return null;

    }
    const updateCommentHandler = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    try {

        await updateComment(
            comment.id,
            description
        );

        refresh();
        close();

    } catch (error) {

        console.error(
            "UPDATE COMMENT ERROR:",
            error
        );

    }

};






    







    return (


        <div className="comment-modal-overlay">



            <div className="edit-comment-modal">





                <div className="modal-header">


                    <h2>

                        Edit Comment

                    </h2>



                    <button

                        onClick={close}

                    >

                        <X size={22}/>

                    </button>


                </div>







                <form

                    onSubmit={updateCommentHandler}

                    className="edit-comment-form"

                >




                    <textarea


                        value={description}


                        onChange={(e)=>

                            setDescription(e.target.value)

                        }


                        required


                    />







                    <button

                        type="submit"

                    >


                        <Save size={18}/>


                        Update Comment


                    </button>





                </form>





            </div>



        </div>


    );



}