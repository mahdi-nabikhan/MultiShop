"use client";

import Link from "next/link";
import {
  Mail,
  Lock
} from "lucide-react";

import "./RegisterForm.css";


export default function RegisterForm() {

  return (

    <div className="register-container">


      <div className="register-card">


        <div className="register-header">

          <h1>
            Create Account
          </h1>

          <p>
            Create your MultiShop account
          </p>

        </div>



        <form className="register-form">


          {/* Email */}

          <div className="input-group">

            <Mail size={20}/>

            <input
              type="email"
              placeholder="Email address"
            />

          </div>



          {/* Password */}

          <div className="input-group">

            <Lock size={20}/>

            <input
              type="password"
              placeholder="Password"
            />

          </div>



          {/* Confirm Password */}

          <div className="input-group">

            <Lock size={20}/>

            <input
              type="password"
              placeholder="Confirm password"
            />

          </div>



          <label className="terms">

            <input
              type="checkbox"
            />

            <span>
              I agree with terms and conditions
            </span>

          </label>




          <button
            type="submit"
            className="register-button"
          >

            Create Account

          </button>


        </form>




        <div className="login-link">


          <span>
            Already have an account?
          </span>


          <Link href="/login">
            Login
          </Link>


        </div>



      </div>


    </div>

  );

}