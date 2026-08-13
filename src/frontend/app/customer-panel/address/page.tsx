"use client";


import {useState} from "react";


import CustomerAddressCreate from "@/components/customer-panel/CustomerAddressCreate/CustomerAddressCreate";
import CustomerAddressList from "@/components/customer-panel/CustomerAddressList/CustomerAddressList";

export default function Page(){


    const [refresh,setRefresh]=useState(0);



    return (

        <>


            <CustomerAddressCreate

                refreshAddresses={()=>setRefresh(prev=>prev+1)}

            />


            <CustomerAddressList

                key={refresh}

            />


        </>


    );


}