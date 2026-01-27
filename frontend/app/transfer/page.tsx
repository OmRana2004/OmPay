"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function Transfer() {
  const router = useRouter();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // 🔊 Audio (created once)
  const successSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSound.current = new Audio("/sounds/success.mp3");
    successSound.current.volume = 0.2;
  }, []);

  async function send() {
    const amt = Number(amount);

    if (!to || !amt || amt <= 0 || loading) return;

    setLoading(true);

    try {
      const res = await api.post("/transfer", {
        to,
        amount: amt,
      });

      setTransactionId(res.data.transactionId);
      setStatus("success");
      successSound.current?.play();

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.replace("/signin");
        return;
      }

      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Navbar />
    <div className="relative min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
      {/* MODAL */}
      {status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-[320px] rounded-2xl bg-white px-6 py-6 text-center shadow-lg">
            <div
              className={`mx-auto mb-4 h-10 w-10 rounded-full ${
                status === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            />

            <h2 className="text-lg font-semibold text-gray-900">
              {status === "success"
                ? "Payment Successful"
                : "Payment Failed"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {status === "success"
                ? "Your payment has been completed"
                : "Something went wrong. Please try again."}
            </p>

            {status === "success" && transactionId && (
              <button
                onClick={() => router.push("/transactions")}
                className="mt-4 w-full rounded-xl border py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-1 focus:ring-gray-400 outline-none"
          />

          <label className="block mt-5 text-sm font-medium text-gray-600">
            Amount
          </label>
          <input
            value={amount}
            onChange={(e) =>
              /^\d*$/.test(e.target.value) && setAmount(e.target.value)
            }
            inputMode="numeric"
            placeholder="Enter amount"
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-1 focus:ring-gray-400 outline-none"
          />

          <button
            onClick={send}
            disabled={loading || !to || !amount}
            className="mt-6 w-full rounded-xl bg-gray-900 text-white py-3 text-lg font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send Money"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
