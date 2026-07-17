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

type Role = "manager" | "admin" | "operator";

interface RoleResponse {
  role: Role;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: Role[];
}

const menuItems: MenuItem[] = [
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
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      try {
        const { data } = await axios.get<RoleResponse>(
          `${BACKEND_URLS}vendor/api/v1/store/user/roles/`,
          {
            withCredentials: true,
          }
        );

        console.log("API Response:", data);

        setRole(data.role);
      } catch (error) {
        console.error("Sidebar Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getRole();
  }, []);

  console.log("Current Role:", role);

  const filteredMenu = role
    ? menuItems.filter((item) => item.roles.includes(role))
    : [];

  console.log("Filtered Menu:", filteredMenu);

  if (loading) {
    return <aside className="sidebar">Loading...</aside>;
  }

  if (!role) {
    return (
      <aside className="sidebar">
        <p>No role found.</p>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        Admin Panel ({role})
      </div>

      <nav>
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="sidebar-link"
            >
              <Icon size={20} />
              <span>{item.title}</span>
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
            <span>Settings</span>
          </Link>
        )}

        <button className="logout-link">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}