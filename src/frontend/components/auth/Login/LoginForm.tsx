"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import BACKEND_URLS from "@/utils";
import "./LoginForm.css";

interface LoginResponse {
  user_id: number;
  redirect_url: string | null;
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post<LoginResponse>(
        `${BACKEND_URLS}account/api/v1/jwt/token/login/`,
        {
          email, 
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (data.redirect_url === "panel") {
        router.push("/shop-admin-panel");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (err) {
  if (axios.isAxiosError(err)) {
    console.log(err.response?.status);
    console.log(err.response?.data);

    setError(JSON.stringify(err.response?.data));
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your MultiShop account</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <Mail size={20} />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link href="/forgot-password">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "12px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          <span>Don't have an account?</span>

          <Link href="/register">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}