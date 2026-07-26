"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

import BACKEND_URLS from "@/utils";

import "@/components/shop/Navbar/Navbar.css";

interface User {
    email: string;
}

export default function Navbar() {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getUser = async () => {

            try {

                const { data } = await axios.get<User>(
                    `${BACKEND_URLS}account/api/v1/profile/`,
                    {
                        withCredentials: true,
                    }
                );

                setUser(data);

            } catch {

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        getUser();

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

            setUser(null);

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

                    ) : user ? (

                        <>

                            <span className="user-email">
                                {user.email}
                            </span>

                            <button
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link href="/login">

                                <button>

                                    Login

                                </button>

                            </Link>

                            <Link href="/register">

                                <button>

                                    Register

                                </button>

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}