"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Tags,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import BACKEND_URLS from "@/utils";

import "./Sidebar.css";

interface RoleResponse {
  role: "manager" | "admin" | "operator";
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/shop-admin-panel",
    roles: ["manager", "admin", "operator"],
  },

  {
    title: "Products",
    icon: Package,
    href: "/shop-admin-panel/products",
    roles: ["manager", "admin", "operator"],
  },

  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/shop-admin-panel/orders",
    roles: ["manager", "admin", "operator"],
  },

  {
    title: "Customers",
    icon: Users,
    href: "/shop-admin-panel/customers",
    roles: ["manager", "admin"],
  },

  {
    title: "Stores",
    icon: Store,
    href: "/shop-admin-panel/store",
    roles: ["manager"],
  },

  {
    title: "Categories",
    icon: Tags,
    href: "/shop-admin-panel/categories",
    roles: ["manager"],
  },

  {
    title: "Reports",
    icon: BarChart3,
    href: "/shop-admin-panel/reports",
    roles: ["manager", "admin"],
  },
];



export default function Sidebar() {

    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function getRole() {

            try {

                const { data } = await axios.get<RoleResponse>(
                    `${BACKEND_URLS}vendor/api/v1/me/`,
                    {
                        withCredentials: true,
                    }
                );

                setRole(data.role);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        }

        getRole();

    }, []);

  if (loading) {
    return null;
}

return (

    <aside className="sidebar">

        <div className="sidebar-title">

            Admin Panel

        </div>

        <nav>

            {menuItems
                .filter((item) => item.roles.includes(role))
                .map((item) => {

                    const Icon = item.icon;

                    return (

                        <Link
                            key={item.title}
                            href={item.href}
                            className="sidebar-link"
                        >

                            <Icon size={20} />

                            <span>

                                {item.title}

                            </span>

                        </Link>

                    );

                })}

        </nav>

        <div className="sidebar-bottom">

            {(role === "manager" || role === "admin") && (

                <Link
                    href="/shop-admin-panel/settings"
                    className="sidebar-link"
                >

                    <Settings size={20} />

                    <span>

                        Settings

                    </span>

                </Link>

            )}

            <button
                className="logout-link"
            >

                <LogOut size={20} />

                <span>

                    Logout

                </span>

            </button>

        </div>

    </aside>

);
}