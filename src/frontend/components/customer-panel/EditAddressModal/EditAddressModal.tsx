"use client";


import {useState,useEffect} from "react";

import axios from "axios";

import BACKEND_URLS from "@/utils";

import "./EditAddressModal.css";




interface Address {


    id:number;

    state:string;

    city:string;

    postal_code:string;


}





interface Props {


    open:boolean;

    onClose:()=>void;

    address:Address;

    refreshAddress:()=>void;


}




export default function EditAddressModal({

    open,

    onClose,

    address,

    refreshAddress


}:Props){



    const [state,setState]=useState("");

    const [city,setCity]=useState("");

    const [postalCode,setPostalCode]=useState("");




    useEffect(()=>{


        if(address){


            setState(address.state);

            setCity(address.city);

            setPostalCode(address.postal_code);


        }


    },[address]);







    if(!open){

        return null;

    }






    const UpdateAddress=async(e:React.FormEvent)=>{


        e.preventDefault();



        try{


            await axios.put(


                `${BACKEND_URLS}customer/api/v1/detail/address/${address.id}/`,

                {


                    state,

                    city,

                    postal_code:postalCode


                },

                {

                    withCredentials:true

                }


            );



            refreshAddress();


            onClose();



        }

        catch(error){


            console.log(error);


        }



    };








    return (

        <div className="modal-overlay">



            <div className="edit-address-modal">



                <div className="modal-header">


                    <h2>

                        Edit Address

                    </h2>


                    <button

                        onClick={onClose}

                    >

                        ×

                    </button>


                </div>







                <form

                    onSubmit={UpdateAddress}

                    className="edit-address-form"

                >



                    <input

                        value={state}

                        onChange={(e)=>setState(e.target.value)}

                        placeholder="State"

                        required

                    />





                    <input

                        value={city}

                        onChange={(e)=>setCity(e.target.value)}

                        placeholder="City"

                        required

                    />





                    <input

                        value={postalCode}

                        onChange={(e)=>setPostalCode(e.target.value)}

                        placeholder="Postal Code"

                        required

                    />







                    <button

                        type="submit"

                    >

                        Update Address

                    </button>




                </form>





            </div>



        </div>


    );


}