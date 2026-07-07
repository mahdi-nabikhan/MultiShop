import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  Bell,
  LogOut
} from "lucide-react";

import "./Navbar.css";


export default function CustomerNavbar() {

  return (

    <header className="customer-navbar">


      <div className="customer-logo">

        <Link href="/">

          MultiShop

        </Link>

      </div>



      <nav className="customer-links">


        <Link href="/profile">

          <User size={18}/>

          Profile

        </Link>


        <Link href="/orders">

          <ShoppingBag size={18}/>

          Orders

        </Link>


        <Link href="/wishlist">

          <Heart size={18}/>

          Wishlist

        </Link>



      </nav>




      <div className="customer-actions">


        <button className="notification-btn">

          <Bell size={20}/>

        </button>



        <div className="customer-user">


          <div className="user-avatar">

            M

          </div>



          <div>

            <span>
              Mahdi
            </span>

            <small>
              Customer
            </small>

          </div>


        </div>



        <button className="logout-btn">

          <LogOut size={18}/>

        </button>


      </div>



    </header>

  );
}