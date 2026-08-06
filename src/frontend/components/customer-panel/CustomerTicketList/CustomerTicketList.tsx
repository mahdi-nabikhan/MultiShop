"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import axios from "axios";

import {
    Ticket,
    Store,
    ChevronRight
} from "lucide-react";

import BACKEND_URLS from "@/utils";

import "./CustomerTicketList.css";

interface Customer {

    id:number;

    username:string;

    is_customer:boolean;

    user:number;

}

interface TicketType{

    pk:number;

    title:string;

    content:string;

    store:number;

    customer:Customer;

}

export default function CustomerTicketList(){

    const [tickets,setTickets]=useState<TicketType[]>([]);

    const [loading,setLoading]=useState(true);

    const GetTickets=async()=>{

        try{

            const {data}=await axios.get<TicketType[]>(

                `${BACKEND_URLS}dashboard/api/v1/customer/list/ticket/`,

                {

                    withCredentials:true

                }

            );

            setTickets(data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        GetTickets();

    },[]);

    if(loading){

        return(

            <div className="ticket-loading">

                Loading Tickets...

            </div>

        )

    }

    return(

        <section className="customer-ticket-list">

            <div className="ticket-header">

                <h2>

                    My Tickets

                </h2>

                <span>

                    {tickets.length} Tickets

                </span>

            </div>

            <div className="ticket-grid">

                {

                    tickets.map(ticket=>(

                        <div

                            className="ticket-card"

                            key={ticket.pk}

                        >

                            <div className="ticket-icon">

                                <Ticket size={30}/>

                            </div>

                            <div className="ticket-content">

                                <h3>

                                    {ticket.title}

                                </h3>

                                <p>

                                    {

                                        ticket.content.length>120

                                        ?

                                        ticket.content.slice(0,120)+"..."

                                        :

                                        ticket.content

                                    }

                                </p>

                                <div className="ticket-footer">

                                    <div className="ticket-store">

                                        <Store size={16}/>

                                        Store #{ticket.store}

                                    </div>

                                    <Link

                                        href={`/customer-panel/tickets/${ticket.pk}`}

                                        className="ticket-detail-btn"

                                    >

                                        View

                                        <ChevronRight size={16}/>

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}