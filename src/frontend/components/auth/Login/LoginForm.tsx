"use client";

import Link from "next/link";
import { Mail, Lock } from "lucide-react";

import "./LoginForm.css";


export default function LoginForm() {


  return (

    <div className="login-container">


      <div className="login-card">


        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your MultiShop account
          </p>

        </div>



        <form className="login-form">


          <div className="input-group">


            <Mail size={20}/>


            <input
              type="email"
              placeholder="Email address"
            />


          </div>



          <div className="input-group">


            <Lock size={20}/>


            <input
              type="password"
              placeholder="Password"
            />


          </div>



          <div className="login-options">


            <label>

              <input type="checkbox"/>

              Remember me

            </label>



            <Link href="/forgot-password">

              Forgot password?

            </Link>


          </div>



          <button
            type="submit"
            className="login-button"
          >

            Login

          </button>



        </form>



        <div className="register-link">


          <span>
            Don't have an account?
          </span>


          <Link href="/register">

            Create Account

          </Link>


        </div>



      </div>


    </div>

  );
}