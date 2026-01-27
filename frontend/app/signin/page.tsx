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

  const handleSignin = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // Backend sets HTTP-only cookie
      await api.post("/signin", {
        email,
        password,
      });

      //  No token handling on frontend
      router.replace("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Welcome
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign in to continue
        </p>

        {/* Email */}
        <label className="text-sm text-gray-600 font-medium">
          Email
        </label>
        <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="
    mt-1 w-full rounded-xl
    border border-gray-200
    bg-white
    px-4 py-3
    text-sm text-gray-900
    placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-indigo-200
  "
  placeholder="you@example.com"
/>

        {/* Password */}
        <label className="mt-4 block text-sm text-gray-600 font-medium">
          Password
        </label>
        <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="
    mt-1 w-full rounded-xl
    border border-gray-200
    bg-white
    px-4 py-3
    text-sm text-gray-900
    placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-indigo-200
  "
  placeholder="••••••••"
/>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignin}
          disabled={loading}
          className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
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
