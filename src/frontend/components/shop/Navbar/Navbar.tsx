"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

import BACKEND_URLS from "@/utils";

import "@/components/shop/Navbar/Navbar.css";

interface Customer {
    id: number;
    username: string;
    is_customer: boolean;
    user: number;
}

export default function Navbar() {



    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {

        const getCustomer = async () => {

            try {

                const { data } = await axios.get<Customer>(
                    `${BACKEND_URLS}customer/api/v1/customer/detail/`,
                    {
                        withCredentials: true,
                    }
                );

                setCustomer(data);

            } catch {

                setCustomer(null);

            } finally {

                setLoading(false);

            }

        };

        getCustomer();

    }, []);


    const logout = async () => {

        try {

            await axios.post(
                `${BACKEND_URLS}account/api/v1/logout/`,
                {},
                {
                    withCredentials: true,
                }
            );

            setCustomer(null);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <nav>

            <div className="container">

                <div className="logo">

                    <Link href="/">
                        MultiShop
                    </Link>

                </div>

                <ul className="nav-links">

                    <li><Link href="/">Home</Link></li>

                    <li><Link href="/products">Products</Link></li>

                    <li><Link href="/stores">Stores</Link></li>

                    <li><Link href="/about">About</Link></li>

                    <li><Link href="/contact">Contact</Link></li>

                </ul>

                <form className="search-box">

                    <input
                        type="text"
                        placeholder="Search products..."
                    />

                    <button>
                        Search
                    </button>

                </form>

                <div className="auth-buttons">

                    {loading ? (

                        <span>Loading...</span>

                    ) : customer ? (

                        <>

                            <span className="user-email">
                                {customer?.username}
                            </span>

                            <button
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link href="/login" className="login-btn">

                                Login

                            </Link>

                            <Link href="/register" className="register-btn">

                               Register

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}