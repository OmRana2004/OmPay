"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await api.post("/signin", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue to OmPay
        </p>

        {/* Email */}
        <label className="block text-sm font-medium text-gray-600">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            mt-1 w-full rounded-xl border border-gray-200
            px-4 py-3 text-gray-900
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
          placeholder="you@example.com"
        />

        {/* Password */}
        <label className="block mt-4 text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            mt-1 w-full rounded-xl border border-gray-200
            px-4 py-3 text-gray-900
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
          placeholder="••••••••"
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={login}
          disabled={loading}
          className="
            mt-6 w-full rounded-xl
            bg-gray-900 text-white
            py-3 text-lg font-medium
            transition
            hover:bg-gray-800
            disabled:opacity-50
          "
        >
          {loading ? "Signing in…" : "Sign In"}
        </motion.button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-gray-900 font-medium cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>
      </motion.div>
    </main>
  );
}
