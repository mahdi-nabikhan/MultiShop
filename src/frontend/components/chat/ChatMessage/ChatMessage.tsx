"use client";

import Link from "next/link";
import { Check, CheckCheck, FileText } from "lucide-react";

import "./ChatMessage.css";


interface Props{

    text:string;

    image:string|null;

    file:string|null;

    sender:"customer"|"seller";

    createdAt:string;

    isRead:boolean;

}


export default function ChatMessage({

    text,

    image,

    file,

    sender,

    createdAt,

    isRead

}:Props){


    const isCustomer = sender==="customer";


    return(

        <div

            className={`chat-message ${isCustomer ? "customer" : "seller"}`}

        >



            <div className="message-bubble">


                {

                    text && (

                        <p>

                            {text}

                        </p>

                    )

                }



                {

                    image && (

                        <img

                            src={image}

                            alt="chat"

                            className="message-image"

                        />

                    )

                }



                {

                    file && (

                        <Link

                            href={file}

                            target="_blank"

                            className="message-file"

                        >

                            <FileText size={18}/>

                            Download File

                        </Link>

                    )

                }




                <div className="message-footer">


                    <span>

                        {

                            new Date(createdAt)

                                .toLocaleTimeString([],{

                                    hour:"2-digit",

                                    minute:"2-digit"

                                })

                        }

                    </span>



                    {

                        isCustomer && (

                            isRead

                            ?

                            <CheckCheck

                                size={16}

                            />

                            :

                            <Check

                                size={16}

                            />

                        )

                    }


                </div>



            </div>



        </div>

    );

}