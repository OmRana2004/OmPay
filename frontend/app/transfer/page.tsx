"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

/* ================= Types ================= */

type TransferResponse = {
  transactionId: string;
};

/* ========================================= */

export default function Transfer() {
  const router = useRouter();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const successSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    successSound.current = new Audio("/sounds/success.mp3");
    successSound.current.volume = 0.2;
  }, []);

  const send = async () => {
    const amt = Number(amount);
    if (!to || !amt || amt <= 0 || loading) return;

    setLoading(true);

    try {
      const res = await api.post<TransferResponse>("/transfer", {
        to,
        amount: amt,
      });

      setTransactionId(res.data.transactionId);
      setStatus("success");
      successSound.current?.play();

      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.replace("/signin");
        return;
      }

      setStatus("error");
      setTimeout(() => setStatus(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-[calc(100vh-64px)] bg-[#F6F7FB] px-4 py-6">
        {/* ===== Modal ===== */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-[320px] rounded-2xl bg-white px-6 py-6 text-center shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                    status === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {status === "success" ? "✓" : "!"}
                </motion.div>

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
                    className="mt-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    View transaction
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Page Content ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md mx-auto space-y-6"
        >
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Send Money
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Fast and secure transfers
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone number or email
              </label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="9876543210 or user@email.com"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Amount
              </label>
              <input
                value={amount}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value) && setAmount(e.target.value)
                }
                inputMode="numeric"
                placeholder="Enter amount"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={send}
              disabled={loading || !to || !amount}
              className="w-full rounded-xl bg-gray-900 py-3.5 text-white text-base font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send Money"}
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
