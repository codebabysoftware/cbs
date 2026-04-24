// src/pages/LoginPage.jsx

import React, {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import API from "../api/api";

/*
=====================================================
CODEBABY LMS - PREMIUM LOGIN PAGE
Brand Reference Saved:
Company Name = Codebaby Software
LMS Name     = Codebaby LMS
=====================================================
*/

const LoginPage = () => {
  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !username ||
        !password
      ) {
        setError(
          "Please enter username and password."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await API.post(
            "/login/",
            {
              username,
              password,
            }
          );

        const data =
          res.data || {};

        localStorage.setItem(
          "token",
          data.token || ""
        );

        localStorage.setItem(
          "role",
          data.role || ""
        );

        localStorage.setItem(
          "username",
          data.username ||
            username
        );

        if (
          remember
        ) {
          localStorage.setItem(
            "remember_user",
            username
          );
        } else {
          localStorage.removeItem(
            "remember_user"
          );
        }

        if (
          data.role ===
          "admin"
        ) {
          navigate(
            "/admin/dashboard"
          );
        } else {
          navigate(
            "/student/dashboard"
          );
        }
      } catch (err) {
        setError(
          err?.response?.data
            ?.error ||
            "Invalid login credentials."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-950 grid lg:grid-cols-2">

      {/* LEFT SIDE BRAND */}
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center px-16">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800" />

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#ffffff,transparent_25%),radial-gradient(circle_at_bottom_left,#ffffff,transparent_25%)]" />

        <div className="relative z-10 text-white max-w-xl">

          {/* LOGO */}
          <div className="h-20 w-20 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <GraduationCap size={38} />
          </div>

          <p className="text-blue-100 text-sm tracking-[0.3em] uppercase mb-3">
            Codebaby Software
          </p>

          <h1 className="text-5xl font-black leading-tight mb-5">
            Codebaby LMS
          </h1>

          <p className="text-lg text-blue-100/90 leading-relaxed mb-10">
            A premium learning management platform
            built for modern education,
            student growth, secure content delivery,
            and scalable online learning.
          </p>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-md">
              <ShieldCheck className="mb-3" />
              <h3 className="font-semibold mb-1">
                Secure Platform
              </h3>
              <p className="text-sm text-blue-100/80">
                Protected lessons, controlled access,
                admin permissions.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-md">
              <Sparkles className="mb-3" />
              <h3 className="font-semibold mb-1">
                Premium UX
              </h3>
              <p className="text-sm text-blue-100/80">
                Responsive interface with smooth
                learning experience.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex items-center justify-center px-5 sm:px-8 py-10 bg-slate-50">

        <div className="w-full max-w-md">

          {/* MOBILE BRAND */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap size={28} />
            </div>

            <h1 className="text-3xl font-black text-slate-900">
              Codebaby LMS
            </h1>

            <p className="text-slate-500 mt-2">
              by Codebaby Software
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-7 sm:p-9">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2">
                Login to continue your learning.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={
                handleLogin
              }
              className="space-y-5"
            >

              {/* USERNAME */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Username
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      username
                    }
                    onChange={(
                      e
                    ) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    placeholder="Enter username"
                    className="w-full h-12 rounded-2xl border border-slate-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(
                      e
                    ) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter password"
                    className="w-full h-12 rounded-2xl border border-slate-200 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-3.5 text-slate-500"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      remember
                    }
                    onChange={() =>
                      setRemember(
                        !remember
                      )
                    }
                    className="rounded"
                  />
                  Remember me
                </label>

                <span className="text-blue-600 font-medium cursor-pointer">
                  Need help?
                </span>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Login"}
                <ArrowRight size={18} />
              </button>

            </form>

            <div className="mt-8 pt-6 border-t text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Codebaby Software
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;