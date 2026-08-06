"use client";


import {
    useEffect,
    useState
} from "react";


import axios from "axios";


import {
    X,
    Save
} from "lucide-react";


import BACKEND_URLS from "@/utils";


import "./EditTicketModal.css";



interface Ticket {


    pk:number;

    title:string;

    content:string;

    store:number;


}



interface Props {


    open:boolean;

    close:()=>void;

    ticket:Ticket;

    refresh:()=>void;


}





export default function EditTicketModal({

    open,

    close,

    ticket,

    refresh


}:Props){



    const [title,setTitle]=useState("");

    const [content,setContent]=useState("");







    useEffect(()=>{


        if(ticket){


            setTitle(ticket.title);

            setContent(ticket.content);


        }



    },[ticket]);







    if(!open){

        return null;

    }








    const UpdateTicket=async(e:React.FormEvent)=>{


        e.preventDefault();



        try{


            await axios.put(


                `${BACKEND_URLS}dashboard/api/v1/detail/ticket/${ticket.pk}/`,


                {


                    title,

                    content,

                    store:ticket.store


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








    return(



        <div className="edit-ticket-overlay">





            <div className="edit-ticket-modal">






                <div className="edit-ticket-header">


                    <h2>

                        Edit Ticket

                    </h2>



                    <button

                        onClick={close}

                    >

                        <X size={22}/>

                    </button>



                </div>








                <form

                    onSubmit={UpdateTicket}

                    className="edit-ticket-form"

                >





                    <label>

                        Title

                    </label>



                    <input


                        value={title}


                        onChange={(e)=>

                            setTitle(e.target.value)

                        }


                        required


                    />






                    <label>

                        Content

                    </label>




                    <textarea


                        value={content}


                        onChange={(e)=>

                            setContent(e.target.value)

                        }


                        required


                    />







                    <button

                        type="submit"

                        className="save-ticket-btn"

                    >

                        <Save size={18}/>


                        Update Ticket


                    </button>






                </form>







            </div>




        </div>



    );

}