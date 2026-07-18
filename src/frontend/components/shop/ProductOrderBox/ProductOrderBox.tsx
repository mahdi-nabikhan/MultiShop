'use client'
import React, { cache } from 'react'
import BACKEND_URLS from '@/utils'
import { useState,useEffect } from 'react'
import axios from 'axios'
import './ProductOrderBox.css'
import { Plus, Minus, ShoppingCart } from "lucide-react";




function ProductOrderBox({productId}:{productId:number|string}) {
    const [quantity,setQuantity]= useState(0)
    const[loading,setLoading]=useState(false)
    const addToCart = async()=> {
        try{
            setLoading(true);
            const response =  await axios.post(
                 `${BACKEND_URLS}order/api/v1/order/item/${productId}/`,
                 {
                    quantity
                 },
                 {withCredentials:true}
            );
            console.log(response)
           
            

        }catch(err){
            console.log(err)

        }finally{
            setLoading(false)
        }
    }
  return (
    <div className="order-box">


            <div className="quantity-box">

                <button
                    onClick={() =>
                        quantity > 1 &&
                        setQuantity(quantity - 1)
                    }
                >
                    <Minus size={18}/>
                </button>


                <span>
                    {quantity}
                </span>


                <button
                    onClick={() =>
                        setQuantity(quantity + 1)
                    }
                >
                    <Plus size={18}/>
                </button>

            </div>



            <button
                className="cart-button"
                onClick={addToCart}
                disabled={loading}
            >

                <ShoppingCart size={20}/>

                {
                    loading
                    ? "Adding..."
                    : "Add To Cart"
                }

            </button>


        </div>
  )
}

export default ProductOrderBox