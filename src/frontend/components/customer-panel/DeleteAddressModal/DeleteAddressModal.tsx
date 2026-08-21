"use client";


import "./DeleteAddressModal.css";
import { deleteAddress } from "@/services/cutomer-panel.services";


interface Props {


    open:boolean;

    onClose:()=>void;

    addressId:number;


}



export default function DeleteAddressModal({

    open,

    onClose,

    addressId


}:Props){



    if(!open){

        return null;

    }






  const DeleteAddress = async () => {

    try {

        await deleteAddress(addressId);

        window.location.href =
            "/customer-panel/addresses";

    } catch (error) {

        console.error(
            "DELETE ADDRESS ERROR:",
            error
        );

    }

};







    return (


        <div className="delete-modal-overlay">



            <div className="delete-address-modal">



                <h2>

                    Delete Address?

                </h2>



                <p>

                    Are you sure you want to delete this address?

                    This action cannot be undone.

                </p>





                <div className="delete-actions">



                    <button

                        className="cancel-delete"

                        onClick={onClose}

                    >

                        Cancel

                    </button>





                    <button

                        className="confirm-delete"

                        onClick={DeleteAddress}

                    >

                        Delete

                    </button>



                </div>



            </div>



        </div>


    );


}