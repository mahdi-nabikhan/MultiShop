"use client";


import {useState,useEffect} from "react";
import { updateAddress } from "@/services/cutomer-panel.services"; 
import "./EditAddressModal.css";
import { Address2 } from "@/types/address";









interface Props {


    open:boolean;

    onClose:()=>void;

    address:Address2;

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






   const updateAddressHandler = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    try {

        await updateAddress(
            address.id,
            {
                state,
                city,
                postal_code: postalCode,
            }
        );

        refreshAddress();
        onClose();

    } catch (error) {

        console.error(
            "UPDATE ADDRESS ERROR:",
            error
        );

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

                    onSubmit={updateAddressHandler}

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