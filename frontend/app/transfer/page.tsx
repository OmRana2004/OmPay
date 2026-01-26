"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Transfer() {
  const router = useRouter();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const successSound =
    typeof window !== "undefined"
      ? new Audio("/sounds/success.mp3")
      : null;

  if (successSound) successSound.volume = 0.2;

  async function send() {
    if (!to || !amount || Number(amount) < 1) return;

    setLoading(true);
    try {
      const res = await api.post("/transfer", {
        to,
        amount: Number(amount),
      });

      setTransactionId(res.data.transactionId);
      setStatus("success");
      successSound?.play();

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      {/* MODAL */}
      {status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[320px] rounded-2xl bg-white px-6 py-6 text-center shadow-lg
                          transition-all duration-300 scale-100 opacity-100">

            <div
              className={`mx-auto mb-4 h-10 w-10 rounded-full
                ${status === "success" ? "bg-green-100" : "bg-red-100"}`}
            />

            <h2 className="text-lg font-semibold text-gray-900">
              {status === "success" ? "Payment Successful" : "Payment Failed"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {status === "success"
                ? "Your payment has been completed"
                : "Something went wrong. Please try again."}
            </p>

            {/* View Transaction */}
            {status === "success" && transactionId && (
              <button
                onClick={() => router.push(`/transactions`)}
                className="mt-4 w-full rounded-xl border border-gray-300
                           py-2 text-sm font-medium text-gray-700
                           transition hover:bg-gray-100"
              >
                View transaction
              </button>
            )}
          </div>
        </div>
      )}

      {/* PAGE */}
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Send Money
        </h1>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-600">
            Phone number or email
          </label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="9876543210 or user@email.com"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <label className="block mt-5 text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            value={amount}
            onChange={(e) => /^\d*$/.test(e.target.value) && setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="Enter amount"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            onClick={send}
            disabled={loading || !to || !amount}
            className="mt-6 w-full rounded-xl bg-gray-900 text-white py-3
                       text-lg font-medium transition
                       hover:bg-gray-800 active:scale-[0.98]
                       disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send Money"}
          </button>
        </div>
      </div>
    </div>
  );
}
