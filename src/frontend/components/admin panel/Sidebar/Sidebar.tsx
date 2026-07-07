"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Tags,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import "./Sidebar.css";


const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin-panel"
  },

  {
    title: "Products",
    icon: Package,
    href: "/admin-panel/products"
  },

  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin-panel/orders"
  },

  {
    title: "Customers",
    icon: Users,
    href: "/admin-panel/customers"
  },

  {
    title: "Stores",
    icon: Store,
    href: "/admin-panel/stores"
  },

  {
    title: "Categories",
    icon: Tags,
    href: "/admin-panel/categories"
  },

  {
    title: "Reports",
    icon: BarChart3,
    href: "/admin-panel/reports"
  },

];


export default function Sidebar(){

  return (

    <aside className="sidebar">


      <div className="sidebar-title">

        Admin Panel

      </div>



      <nav>


        {menuItems.map((item)=>{

          const Icon = item.icon;


          return (

            <Link
              key={item.title}
              href={item.href}
              className="sidebar-link"
            >

              <Icon size={20}/>

              <span>
                {item.title}
              </span>


            </Link>

          )

        })}


      </nav>



      <div className="sidebar-bottom">


        <Link
          href="/admin-panel/settings"
          className="sidebar-link"
        >

          <Settings size={20}/>

          <span>
            Settings
          </span>

        </Link>



        <button className="logout-link">

          <LogOut size={20}/>

          <span>
            Logout
          </span>

        </button>


      </div>


    </aside>

  )

}