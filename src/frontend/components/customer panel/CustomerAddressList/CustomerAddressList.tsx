"use client";


import { useEffect, useState } from "react";

import axios from "axios";

import {
    MapPin,
    Hash
} from "lucide-react";


import BACKEND_URLS from "@/utils";

import "./CustomerAddressList.css";




interface Customer {


    username:string;


}



interface Address {


    id:number;

    state:string;

    city:string;

    postal_code:string;

    customer:Customer;


}




export default function CustomerAddressList(){



    const [addresses,setAddresses] = useState<Address[]>([]);

    const [loading,setLoading] = useState(true);





    const GetAddresses = async()=>{


        try{


            const {data}=await axios.get<Address[]>(


                `${BACKEND_URLS}customer/api/v1/add/address/`,

                {

                    withCredentials:true

                }


            );


            setAddresses(data);


        }

        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    };







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