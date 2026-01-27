"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;

    const { firstName, lastName, email, phone, password } = form;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/signup", form);

      // ✅ Signup ke baad login page
      router.replace("/signin");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Create account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Get started with OmPay
        </p>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First name
            </label>
            <input
              value={form.firstName}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Last name
            </label>
            <input
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Doe"
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Email address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone number
            </label>
            <input
              value={form.phone}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setForm({ ...form, phone: e.target.value });
                }
              }}
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="9876543210"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gray-900 text-white py-3
                     font-medium hover:bg-gray-800 active:scale-[0.98]
                     disabled:opacity-50  cursor-pointer"
        >
          {loading ? "Creating account…" : "Sign Up"}
        </button>

        {/* FOOTER */}
        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signin")}
            className="text-gray-900 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
