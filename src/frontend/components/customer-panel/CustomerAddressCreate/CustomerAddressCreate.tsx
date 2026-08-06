"use client";


import {useState} from "react";

import axios from "axios";

import {
    MapPin,
    Plus
} from "lucide-react";


import BACKEND_URLS from "@/utils";


import "./CustomerAddressCreate.css";




interface Props {

    refreshAddresses:()=>void;

}




export default function CustomerAddressCreate({

    refreshAddresses

}:Props){



    const [state,setState]=useState("");

    const [city,setCity]=useState("");

    const [postalCode,setPostalCode]=useState("");

    const [loading,setLoading]=useState(false);






    const CreateAddress=async(e:React.FormEvent)=>{


        e.preventDefault();


        try{


            setLoading(true);



            await axios.post(


                `${BACKEND_URLS}customer/api/v1/add/address/`,


                {


                    state,

                    city,

                    postal_code:postalCode


                },


                {


                    withCredentials:true


                }


            );



            setState("");

            setCity("");

            setPostalCode("");



            refreshAddresses();



        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }



    };






    return (


        <section className="create-address">





            <div className="create-address-header">


                <div className="address-title-icon">

                    <MapPin size={24}/>

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

                    onChange={(e)=>setState(e.target.value)}

                    required

                />





                <input

                    type="text"

                    placeholder="City"

                    value={city}

                    onChange={(e)=>setCity(e.target.value)}

                    required

                />






                <input

                    type="text"

                    placeholder="Postal Code"

                    value={postalCode}

                    onChange={(e)=>setPostalCode(e.target.value)}

                    required

                />






                <button

                    type="submit"

                    disabled={loading}

                >


                    <Plus size={18}/>


                    {

                        loading

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