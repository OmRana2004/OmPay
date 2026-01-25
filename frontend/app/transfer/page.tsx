"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Transfer() {
  const router = useRouter();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!to || !amount) return;

    setLoading(true);
    try {
      await api.post("/transfer", {
        to, // phone number or email
        amount: Number(amount),
      });

      // ✅ redirect after successful transfer
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      <div className="max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Send Money
        </h1>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Recipient */}
          <label className="block text-sm font-medium text-gray-600">
            Phone number or email
          </label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="9876543210 or user@email.com"
            className="
              mt-2 w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-gray-300
              transition
            "
          />

          {/* Amount (manual typing only) */}
          <label className="block mt-5 text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            value={amount}
            onChange={(e) => {
              // allow digits only
              if (/^\d*$/.test(e.target.value)) {
                setAmount(e.target.value);
              }
            }}
            type="text"
            inputMode="numeric"
            placeholder="Enter amount"
            className="
              mt-2 w-full rounded-xl
              border border-gray-200
              bg-white
              px-4 py-3
              text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-gray-300
              transition
            "
          />

          {/* Button */}
          <button
            onClick={send}
            disabled={loading}
            className="
              mt-6 w-full rounded-xl
              bg-gray-900 text-white
              py-3 text-lg font-medium
              transition
              hover:bg-gray-800
              active:scale-[0.98]
              disabled:opacity-50
            "
          >
            {loading ? "Sending…" : "Send Money"}
          </button>
        </div>

        {/* Helper text */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Transfers are secure and instant
        </p>
      </div>
    </div>
  );
}
