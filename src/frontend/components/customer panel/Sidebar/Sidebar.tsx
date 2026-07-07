"use client";

import Link from "next/link";

import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Shield,
  Settings,
  LogOut
} from "lucide-react";

import "./Sidebar.css";


const menuItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },

  {
    title: "My Orders",
    href: "/orders",
    icon: ShoppingBag,
  },

  {
    title: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },

  {
    title: "Addresses",
    href: "/addresses",
    icon: MapPin,
  },

  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },

  {
    title: "Security",
    href: "/security",
    icon: Shield,
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];


export default function CustomerSidebar() {


  return (

    <aside className="customer-sidebar">


      {/* User Card */}

      <div className="customer-card">


        <div className="customer-avatar">

          M

        </div>


        <h3>
          Mahdi
        </h3>


        <p>
          Premium Customer
        </p>


      </div>




      {/* Menu */}

      <nav className="customer-menu">


        {
          menuItems.map((item)=>{


            const Icon = item.icon;


            return (

              <Link
                href={item.href}
                key={item.title}
                className="customer-menu-item"
              >

                <Icon size={20}/>

                <span>
                  {item.title}
                </span>


              </Link>

            )


          })
        }


      </nav>



      {/* Logout */}

      <button className="customer-logout">


        <LogOut size={20}/>


        Logout


      </button>



    </aside>

  );
}