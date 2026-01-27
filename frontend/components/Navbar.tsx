"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "../lib/api";

/* ================= Types ================= */

type BalanceResponse = {
  balance: number;
};

/* ========================================= */

export default function Navbar() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const res = await api.get<BalanceResponse>("/balance");
        setBalance(res.data.balance);
      } catch {
        setBalance(null);
      }
    };

    loadBalance();
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setBalance(null);
      router.replace("/signin");
    }
  };

  return (
    <motion.nav
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-20 overflow-hidden border-b border-gray-200"
    >
      {/* 🌈 Soothing animated background */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(243,244,246,0.9), rgba(255,255,255,0.9), rgba(240,249,255,0.9))",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Glass layer */}
      <div className="relative backdrop-blur-md bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Brand */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              O
            </div>
            <span className="text-lg font-semibold text-gray-900">
              OmPay
            </span>
          </motion.div>

          {/* Balance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100/80 backdrop-blur text-sm"
          >
            <span className="text-gray-500">Balance</span>
            {balance === null ? (
              <span className="text-gray-400">—</span>
            ) : (
              <span className="font-semibold text-gray-900">
                ₹{balance.toLocaleString("en-IN")}
              </span>
            )}
          </motion.div>

          {/* Logout */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
