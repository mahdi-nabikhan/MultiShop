"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerQueryKeys } from "@/Lib/query-keys/customer.keys"; 
import { updateAddress } from "@/services/cutomer-panel.services";
import { Address2 } from "@/types/address";

import "./EditAddressModal.css";


interface Props {
    open: boolean;
    onClose: () => void;
    address: Address2;
}


export default function EditAddressModal({
    open,
    onClose,
    address,
}: Props) {

    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");


    const queryClient = useQueryClient();


    /* =========================
       LOAD ADDRESS DATA
    ========================= */

    useEffect(() => {

        if (address) {

            setState(address.state);
            setCity(address.city);
            setPostalCode(address.postal_code);

        }

    }, [address]);


    /* =========================
       UPDATE ADDRESS
    ========================= */

    const updateAddressMutation = useMutation({

        mutationFn: () =>
            updateAddress(
                address.id,
                {
                    state,
                    city,
                    postal_code: postalCode,
                }
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: customerQueryKeys.address(address.id),
            });

            onClose();

        },

        onError: (error) => {

            console.error(
                "UPDATE ADDRESS ERROR:",
                error
            );

        },

    });


    /* =========================
       SUBMIT
    ========================= */

    const updateAddressHandler = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        updateAddressMutation.mutate();

    };


    if (!open) {

        return null;

    }


    return (

        <div className="modal-overlay">

            <div className="edit-address-modal">


                {/* HEADER */}

                <div className="modal-header">

                    <h2>
                        Edit Address
                    </h2>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={
                            updateAddressMutation.isPending
                        }
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={updateAddressHandler}
                    className="edit-address-form"
                >


                    <input
                        value={state}
                        onChange={(e) =>
                            setState(e.target.value)
                        }
                        placeholder="State"
                        required
                        disabled={
                            updateAddressMutation.isPending
                        }
                    />


                    <input
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        placeholder="City"
                        required
                        disabled={
                            updateAddressMutation.isPending
                        }
                    />


                    <input
                        value={postalCode}
                        onChange={(e) =>
                            setPostalCode(e.target.value)
                        }
                        placeholder="Postal Code"
                        required
                        disabled={
                            updateAddressMutation.isPending
                        }
                    />


                    <button
                        type="submit"
                        disabled={
                            updateAddressMutation.isPending
                        }
                    >

                        {
                            updateAddressMutation.isPending
                                ? "Updating..."
                                : "Update Address"
                        }

                    </button>


                </form>


            </div>

        </div>

    );

}