"use client";


import axios from "axios";


import {
    Trash2,
    X
} from "lucide-react";


import {
    useRouter
} from "next/navigation";


import BACKEND_URLS from "@/utils";


import "./DeleteTicketModal.css";





interface Props{


    open:boolean;

    close:()=>void;

    ticketId:number;


}





export default function DeleteTicketModal({

    open,

    close,

    ticketId


}:Props){



    const router = useRouter();







    if(!open){

        return null;

    }







    const DeleteTicket=async()=>{


        try{


            await axios.delete(


                `${BACKEND_URLS}dashboard/api/v1/detail/ticket/${ticketId}/`,


                {


                    withCredentials:true


                }


            );



            router.push("/customer-panel/tickets");



        }


        catch(error){


            console.log(error);


        }



    };







    return(



        <div className="delete-ticket-overlay">





            <div className="delete-ticket-modal">







                <button

                    className="delete-close"

                    onClick={close}

                >

                    <X size={22}/>

                </button>







                <div className="delete-ticket-icon">


                    <Trash2 size={38}/>


                </div>








                <h2>

                    Delete Ticket?

                </h2>





                <p>

                    Are you sure you want to delete this ticket?

                    This action cannot be undone.

                </p>








                <div className="delete-ticket-actions">





                    <button

                        className="cancel-delete-ticket"

                        onClick={close}

                    >

                        Cancel

                    </button>







                    <button

                        className="confirm-delete-ticket"

                        onClick={DeleteTicket}

                    >

                        <Trash2 size={18}/>

                        Delete

                    </button>






                </div>






            </div>






        </div>



    );


}