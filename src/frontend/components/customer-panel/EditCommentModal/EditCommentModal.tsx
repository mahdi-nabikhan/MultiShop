"use client";


import {useEffect,useState} from "react";

import axios from "axios";

import {
    X,
    Save
} from "lucide-react";


import BACKEND_URLS from "@/utils";

import "./EditCommentModal.css";



interface Comment {


    id:number;

    descriptions:string;


}




interface Props {


    open:boolean;

    close:()=>void;

    comment:Comment;

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







    const UpdateComment=async(e:React.FormEvent)=>{


        e.preventDefault();



        try{


            await axios.put(


                `${BACKEND_URLS}customer/api/v1/detail/comment/${comment.id}/`,


                {


                    descriptions:description


                },


                {


                    withCredentials:true


                }


            );



            refresh();


            close();



        }

        catch(error){


            console.log(error);


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

                    onSubmit={UpdateComment}

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