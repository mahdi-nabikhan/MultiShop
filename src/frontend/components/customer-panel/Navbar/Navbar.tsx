"use client";

import Link from "next/link";
import {
    Search,
    ShoppingCart,
    Bell,
    Heart,
    ChevronDown,
    Menu
} from "lucide-react";

import "./Navbar.css";

export default function Navbar() {

    return (

        <header className="customer-navbar">

            <div className="navbar-left">

                <button className="mobile-menu">

                    <Menu size={24} />

                </button>

                <Link
                    href="/"
                    className="navbar-logo"
                >

                    <span className="logo-dot"></span>

                    MultiShop

                </Link>

            </div>

            <div className="navbar-search">

                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search products..."
                />

            </div>

            <div className="navbar-right">

                <button className="navbar-icon">

                    <Heart size={20} />

                    <span className="badge">

                        2

                    </span>

                </button>

                <button className="navbar-icon">

                    <ShoppingCart size={20} />

                    <span className="badge">

                        4

                    </span>

                </button>

                <button className="navbar-icon">

                    <Bell size={20} />

                    <span className="badge">

                        1

                    </span>

                </button>

                <button className="customer-profile">

                    <div className="profile-avatar">

                        M

                    </div>

                    <div className="profile-info">

                        <span>

                            Mahdi

                        </span>

                        <small>

                            Premium Member

                        </small>

                    </div>

                    <ChevronDown size={18} />

                </button>

            </div>

        </header>

    );

}