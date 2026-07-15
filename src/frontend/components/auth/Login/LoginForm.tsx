"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import BACKEND_URLS from "@/utils";
import "./LoginForm.css";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user_id: number;
  redirect_url: string | null;
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await axios.post<LoginResponse>(
        `${BACKEND_URLS}account/api/v1/jwt/token/login/`,
        data,
        {
          withCredentials: true,
        }
      );

      return response.data;
    },

    onSuccess(data) {
      if (data.redirect_url === "panel") {
        router.push("/shop-admin-panel");
      } else {
        router.push("/");
      }

      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your MultiShop account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={20} />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {loginMutation.error &&
            axios.isAxiosError(loginMutation.error) && (
              <p
                style={{
                  color: "red",
                  marginBottom: "12px",
                }}
              >
                {JSON.stringify(loginMutation.error.response?.data)}
              </p>
            )}

          <button
            type="submit"
            className="login-button"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? "Logging in..."
              : "Login"}
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