"use client";

import useAddresses from "@/hooks/customer/useAddresses";

import {
    MapPin,
    Hash
} from "lucide-react";



import "./CustomerAddressList.css";


export default function CustomerAddressList() {
    const {
        data: addresses = [],
        isLoading,
        isError,
    } = useAddresses()



    if (isError) {
        return (
            <div className="address-loading">
                Failed to load addresses.
            </div>
        );
    }





    if (isLoading) {


        return (

            <div className="address-loading">

                Loading Addresses...

            </div>

        )


    }






    return (


        <section className="customer-addresses">





            <div className="address-header">


                <h2>

                    My Addresses

                </h2>


                <p>

                    Manage your delivery addresses

                </p>


            </div>







            <div className="address-grid">



                {


                    addresses.map((address) => (



                        <div

                            className="address-card"

                            key={address.id}

                        >




                            <div className="address-icon">


                                <MapPin size={28} />


                            </div>





                            <div className="address-content">



                                <h3>

                                    {address.city}

                                </h3>



                                <p>

                                    {address.state}

                                </p>



                                <div className="postal">


                                    <Hash size={16} />


                                    {address.postal_code}


                                </div>



                            </div>





                        </div>


                    ))



                }



            </div>




        </section>


    );



}