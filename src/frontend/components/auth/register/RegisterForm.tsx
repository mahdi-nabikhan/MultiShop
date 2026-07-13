"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";

import BACKEND_URLS from "@/utils";
import "./RegisterForm.css";

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${BACKEND_URLS}customer/api/v1/customer/register/`,
        {
          username,
          user: {
            email,
            password,
            password2,
          },
        },
        {
          withCredentials: true,
        }
      );

      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data === "string"
            ? err.response.data
            : JSON.stringify(err.response?.data)
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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