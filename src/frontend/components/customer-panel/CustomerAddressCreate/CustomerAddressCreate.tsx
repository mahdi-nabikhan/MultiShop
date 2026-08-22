"use client";


import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createAddress } from "@/services/cutomer-panel.services";

import {MapPin,Plus} from "lucide-react";
import "./CustomerAddressCreate.css";


interface Props {refreshAddresses: () => void;}


export default function CustomerAddressCreate({refreshAddresses}: Props) {



    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const createAddressMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: () => {

            setState("");
            setCity("");
            setPostalCode("");
            refreshAddresses();
        },
        onError: (error) => {
            console.log(error);
        },
    });






    const CreateAddress = (e: React.FormEvent) => {e.preventDefault();
        createAddressMutation.mutate({
            state,
            city,
            postal_code: postalCode,});};
    return (
        <section className="create-address">
            <div className="create-address-header">
                <div className="address-title-icon">
                    <MapPin size={24} />
                </div>
                <div>
                    <h2>
                       Add New Address
                    </h2>
                    <p>
                        Create a new delivery address
                    </p>

                </div>


            </div>






            <form

                onSubmit={CreateAddress}

                className="address-form"

            >



                <input

                    type="text"

                    placeholder="State"

                    value={state}

                    onChange={(e) => setState(e.target.value)}

                    required

                />





                <input

                    type="text"

                    placeholder="City"

                    value={city}

                    onChange={(e) => setCity(e.target.value)}

                    required

                />






                <input

                    type="text"

                    placeholder="Postal Code"

                    value={postalCode}

                    onChange={(e) => setPostalCode(e.target.value)}

                    required

                />






                <button

                    type="submit"

                    disabled={createAddressMutation.isPending}

                >


                    <Plus size={18} />


                    {

                        createAddressMutation.isPending

                            ?

                            "Adding..."

                            :

                            "Add Address"

                    }


                </button>



            </form>



        </section>


    );


}