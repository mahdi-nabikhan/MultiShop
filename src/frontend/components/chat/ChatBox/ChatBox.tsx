"use client";

import {useEffect,useRef,useState} from "react";

import axios from "axios";

import BACKEND_URLS from "@/utils";

import ChatMessage from "../ChatMessage/ChatMessage";
import ChatInput from "../ChatInput/ChatInput";

import "./ChatBox.css";


interface Message{

    id:number;

    text:string;

    image:string|null;

    file:string|null;

    created_at:string;

    sender:number;

    sender_name:string;

    is_read:boolean;

}


interface Props{

    storeId:number;

    currentUserId:number;

}



export default function ChatBox({

    storeId,

    currentUserId

}:Props){


    const [conversationId,setConversationId]=useState<number|null>(null);

    const [messages,setMessages]=useState<Message[]>([]);

    const [loading,setLoading]=useState(true);

    const messagesEndRef=useRef<HTMLDivElement>(null);




    const CreateConversation=async()=>{


        try{
        console.log("STORE ID:", storeId);
        console.log("STORE ID TYPE:", typeof storeId);

            const {data}=await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/chat/conversations/`,

                {

                    store:storeId

                },

                {

                    withCredentials:true

                }

            );


            setConversationId(data.conversation_id);


        }

        catch(error:any){
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("ERROR:", error);

        }


    };





    const GetMessages=async(id:number)=>{


        try{


            const {data}=await axios.get(

                `${BACKEND_URLS}dashboard/api/v1/conversations/${id}/messages/list/`,

                {

                    withCredentials:true

                }

            );


            setMessages(data);


        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }


    };





    const SendMessage=async(text:string)=>{


        if(!conversationId) return;


        try{


            await axios.post(

                `${BACKEND_URLS}dashboard/api/v1/conversations/${conversationId}/messages/`,

                {

                    text

                },

                {

                    withCredentials:true

                }

            );


            GetMessages(conversationId);


        }

        catch(error){

            console.log(error);

        }


    };






    useEffect(()=>{


        CreateConversation();


    },[]);






    useEffect(()=>{


        if(conversationId){

            GetMessages(conversationId);

        }


    },[conversationId]);






    useEffect(()=>{


        messagesEndRef.current?.scrollIntoView({

            behavior:"smooth"

        });


    },[messages]);






    useEffect(()=>{


        if(!conversationId) return;


        const interval=setInterval(()=>{


            GetMessages(conversationId);


        },3000);



        return()=>clearInterval(interval);


    },[conversationId]);







    if(loading){

        return(

            <section className="chatbox">

                Loading...

            </section>

        );

    }






    return(

        <section className="chatbox">



            <div className="chat-header">


                <div className="seller-info">


                    <div className="avatar">

                        S

                    </div>



                    <div>


                        <h3>

                            Store Chat

                        </h3>


                        <span>

                            Online

                        </span>


                    </div>



                </div>



            </div>





            <div className="chat-body">


                {

                    messages.map(message=>(


                        <ChatMessage

                            key={message.id}

                            text={message.text}

                            image={message.image}

                            file={message.file}

                            sender={

                                message.sender===currentUserId

                                ?

                                "customer"

                                :

                                "seller"

                            }

                            createdAt={message.created_at}

                            isRead={message.is_read}

                        />


                    ))

                }


                <div ref={messagesEndRef}></div>


            </div>





            <ChatInput

                onSend={SendMessage}

            />



        </section>

    );


}