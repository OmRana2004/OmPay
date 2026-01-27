"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function Navbar() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadBalance() {
      try {
        const res = await api.get("/balance");
        setBalance(res.data.balance);
      } catch {
        // ❌ Not logged in / cookie expired
        setBalance(null);
      }
    }

    loadBalance();
  }, []);

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    } finally {
      setBalance(null);
      router.replace("/signin");
    }
  }

  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-white/90 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            O
          </div>
          <span className="text-lg font-semibold text-blue-600">
            OmPay
          </span>
        </div>

        {/* Balance */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-sm">
          <span className="text-gray-500">Balance</span>
          {balance === null ? (
            <span className="text-gray-400">—</span>
          ) : (
            <span className="font-semibold text-gray-900">
              ₹{balance}
            </span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
