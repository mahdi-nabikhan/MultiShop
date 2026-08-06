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
    LogOut,
    Package
} from "lucide-react";

import "./Sidebar.css";


const menuGroups = [

    {
        title:"Shopping",

        items:[

            {
                title:"My Orders",
                href:"/customer-panel/orders",
                icon:ShoppingBag
            },

            {
                title:"Wishlist",
                href:"/customer-panel/wishlist",
                icon:Heart
            },

            {
                title:"Payments",
                href:"/customer-panel/payments",
                icon:CreditCard
            }

        ]

    },


    {
        title:"Account",

        items:[

            {
                title:"Profile",
                href:"/customer-panel/profile",
                icon:User
            },


            {
                title:"Addresses",
                href:"/customer-panel/addresses",
                icon:MapPin
            },


            {
                title:"Security",
                href:"/customer-panel/security",
                icon:Shield
            },


            {
                title:"Settings",
                href:"/customer-panel/settings",
                icon:Settings
            }

        ]

    }

];



export default function CustomerSidebar(){


    return (

        <aside className="customer-sidebar">


            {/* User Card */}

            <div className="sidebar-user-card">


                <div className="sidebar-avatar">

                    M

                </div>


                <div className="sidebar-user-info">

                    <h3>

                        Mahdi

                    </h3>


                    <p>

                        Premium Member

                    </p>


                </div>


            </div>




            {/* Menu */}


            <nav className="sidebar-menu">


                {

                    menuGroups.map((group)=>(


                        <div
                            className="sidebar-group"
                            key={group.title}
                        >


                            <span className="group-title">

                                {group.title}

                            </span>



                            {

                                group.items.map((item)=>{


                                    const Icon=item.icon;



                                    return (

                                        <Link

                                            href={item.href}

                                            className="sidebar-item"

                                            key={item.title}

                                        >


                                            <Icon size={20}/>


                                            <span>

                                                {item.title}

                                            </span>


                                        </Link>

                                    )

                                })

                            }


                        </div>


                    ))

                }


            </nav>




            {/* Logout */}


            <button className="sidebar-logout">


                <LogOut size={20}/>


                Logout


            </button>



        </aside>

    )

}