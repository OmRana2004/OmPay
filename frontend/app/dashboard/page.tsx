"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [balanceRes, meRes] = await Promise.all([
          api.get("/balance"), // protected by backend authMiddleware
          api.get("/me"),
        ]);

        setBalance(balanceRes.data.balance);
        setName(meRes.data.firstName);
      } catch (err: any) {
        // ❌ Cookie missing / expired / invalid
        router.replace("/signin");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  // ⏳ Prevent UI flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <>
      <Navbar />
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Greeting */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Hi{ name ? `, ${name}` : "" } 👋
        </h1>

        {/* Balance Card */}
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <p className="text-sm text-gray-500">Available Balance</p>

          <p className="mt-3 text-4xl font-semibold text-gray-900">
            ₹{balance}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push("/transfer")}
            className="w-full rounded-xl bg-gray-900 text-white py-3 text-lg font-medium hover:bg-gray-800 active:scale-[0.98]"
          >
            Send Money
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="w-full rounded-xl bg-white border py-3 text-lg font-medium text-gray-800 hover:bg-gray-100 active:scale-[0.98]"
          >
            View Transactions
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Secure • Reliable • Simple
        </p>
      </div>
    </div>
    </>
  );
}
