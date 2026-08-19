"use client";


import { useEffect, useState } from "react";

import { getAddresses,Address } from "@/services/cutomer-panel.services"; 

import {
    MapPin,
    Hash
} from "lucide-react";



import "./CustomerAddressList.css";









export default function CustomerAddressList(){



    const [addresses,setAddresses] = useState<Address[]>([]);

    const [loading,setLoading] = useState(true);





   const GetAddresses = async () => {
    try {
        const data = await getAddresses();

        setAddresses(data);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }};







    useEffect(()=>{


        GetAddresses();


    },[]);







    if(loading){


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


                addresses.map((address)=>(



                    <div

                        className="address-card"

                        key={address.id}

                    >




                        <div className="address-icon">


                            <MapPin size={28}/>


                        </div>





                        <div className="address-content">



                            <h3>

                                {address.city}

                            </h3>



                            <p>

                                {address.state}

                            </p>



                            <div className="postal">


                                <Hash size={16}/>


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