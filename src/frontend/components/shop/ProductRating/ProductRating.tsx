"use client";


import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductRating.css";



interface ProductRatingProps {

    productId:number;

    isAuthenticated:boolean;

}



export default function ProductRating({

    productId,

    isAuthenticated

}:ProductRatingProps){



    const [canRate,setCanRate] = useState(false);

    const [loading,setLoading] = useState(true);

    const [selectedRate,setSelectedRate] = useState(0);

    const [hoverRate,setHoverRate] = useState(0);

    const [sending,setSending] = useState(false);

    const [message,setMessage] = useState("");





    /*
        اگر کاربر لاگین نیست
        هیچ کاری انجام نشود
    */


    useEffect(()=>{


        if(!isAuthenticated){

            setLoading(false);

            return;

        }



        async function checkRate(){


            try{


                const response = await axios.get(


                    `http://localhost:8000/customer/api/v1/product/${productId}/can-rate/`,


                    {

                        withCredentials:true

                    }


                );



                setCanRate(

                    response.data.can_rate

                );



            }
            catch(error){


                console.log(error);


            }
            finally{


                setLoading(false);


            }


        }



        checkRate();



    },[productId,isAuthenticated]);







    async function addRate(){



        if(selectedRate===0)

            return;




        try{


            setSending(true);



            await axios.post(


                `http://localhost:8000/customer/api/v1/add/product/rate/${productId}/`,


                {


                    rate:selectedRate


                },


                {


                    withCredentials:true

                }


            );



            setCanRate(false);


            setMessage(

                "Rating submitted successfully"

            );



        }
        catch(error){


            console.log(error);


            setMessage(

                "Error submitting rating"

            );


        }
        finally{


            setSending(false);


        }


    }







    /*
        کاربر مهمان
    */


    if(!isAuthenticated){

        return null;

    }







    if(loading){


        return (

            <div className="rating-loading">

                Loading...

            </div>

        );

    }






    return (

        <div className="product-rating">



            <h3>

                Rate This Product

            </h3>




            {

                canRate ?


                <>


                    <div className="rating-stars">


                        {

                            [1,2,3,4,5].map((star)=>(


                                <button

                                    key={star}


                                    onMouseEnter={()=>setHoverRate(star)}


                                    onMouseLeave={()=>setHoverRate(0)}


                                    onClick={()=>setSelectedRate(star)}



                                    className={

                                        star <= (hoverRate || selectedRate)

                                        ?

                                        "active"

                                        :

                                        ""

                                    }

                                >

                                    ★

                                </button>


                            ))

                        }


                    </div>




                    <button

                        className="rating-submit"

                        onClick={addRate}

                        disabled={sending}


                    >

                        {

                            sending

                            ?

                            "Sending..."

                            :

                            "Submit Rating"

                        }


                    </button>


                </>


                :


                <p className="rated-text">

                    You already rated this product.

                </p>


            }





            {

                message &&


                <p className="success-message">

                    {message}

                </p>


            }



        </div>

    );


}