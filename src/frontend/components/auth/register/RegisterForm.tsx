"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import "./RegisterForm.css";
import { register } from "@/services/auth.services";
export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: () => {
      router.push("/");
    },
  });




  function handlerSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    registerMutation.mutate({
      username,
      user: {
        email,
        password,
        password2,
      },
    });
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Create your MultiShop account</p>
        </div>

        <form className="register-form" onSubmit={handlerSubmit}>
          {/* Username */}
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Confirm password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          <label className="terms">
            <input type="checkbox" required />
            <span>I agree with terms and conditions</span>
          </label>

          {registerMutation.error && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {axios.isAxiosError(registerMutation.error)
                ? typeof registerMutation.error.response?.data === "string"
                  ? registerMutation.error.response.data
                  : JSON.stringify(
                    registerMutation.error.response?.data
                  )
                : "Something went wrong."}
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="login-link">
          <span>Already have an account?</span>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}