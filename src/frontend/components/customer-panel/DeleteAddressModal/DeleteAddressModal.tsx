"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./DeleteAddressModal.css";
import { deleteAddress } from "@/services/cutomer-panel.services";


interface Props {


    open: boolean;

    onClose: () => void;

    addressId: number;


}



export default function DeleteAddressModal({

    open,

    onClose,

    addressId


}: Props) {




    const queryClient = useQueryClient();

    const {
        mutate: DeleteAddress,
        isPending,
    } = useMutation({
        mutationFn: () => deleteAddress(addressId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["addresses"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["address-detail", addressId],
            });

            onClose();
        },

        onError: (error) => {
            console.error(
                "DELETE ADDRESS ERROR:",
                error
            );
        },
    });








    if (!open) {

        return null;

    }













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
                        onClick={() => DeleteAddress()}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>



                </div>



            </div>



        </div>


    );


}