"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [balanceRes, meRes] = await Promise.all([
          api.get("/balance"),
          api.get("/me"),
        ]);

        setBalance(balanceRes.data.balance);
        setName(meRes.data.user.firstName);
      } catch {
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  /* ================= Skeleton Loader ================= */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] bg-[#F6F7FB] px-4 py-6 flex justify-center">
          <div className="w-full max-w-md space-y-6 animate-pulse">
            
            {/* Greeting */}
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-3 w-40 rounded bg-gray-100" />
            </div>

            {/* Balance Card */}
            <div className="h-32 rounded-2xl bg-gray-200" />

            {/* Buttons */}
            <div className="space-y-3">
              <div className="h-12 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-100" />
            </div>
          </div>
        </main>
      </>
    );
  }
  /* =================================================== */

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] px-4 py-6 sm:px-6 bg-[#F6F7FB]">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Greeting */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Hi{name ? `, ${name}` : ""} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back to OmPay
            </p>
          </div>

          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 p-6 text-white shadow-lg">
            <p className="text-sm text-gray-300">
              Available Balance
            </p>

            <p className="mt-4 text-4xl font-bold tracking-tight">
              ₹{balance?.toLocaleString("en-IN")}
            </p>

            <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/transfer")}
              className="w-full rounded-xl bg-gray-900 py-3.5 text-base font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] cursor-pointer"
            >
              Send Money
            </button>

            <button
              onClick={() => router.push("/transactions")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 text-base font-medium text-gray-900 transition hover:bg-gray-100 active:scale-[0.98] cursor-pointer"
            >
              View Transactions
            </button>
          </div>

          {/* Footer */}
          <p className="pt-6 text-center text-xs text-gray-400">
            Bank-grade security • Instant transfers
          </p>
        </div>
      </main>
    </>
  );
}
