"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

/* ================= Types ================= */

type Transaction = {
  id: number;
  amount: number;
  fromId: string;
  toId: string;
  createdAt: string;
  from: {
    firstName: string;
    lastName: string;
  };
  to: {
    firstName: string;
    lastName: string;
  };
};

type TransactionsResponse = {
  transactions: Transaction[];
  userId: string;
};

/* ========================================= */

/* ================= Skeleton ================= */
function TransactionSkeleton() {
  return (
    <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-44 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
      <div className="h-5 w-20 bg-gray-200 rounded" />
    </div>
  );
}
/* ============================================ */

export default function Transactions() {
  const router = useRouter();
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await api.get<TransactionsResponse>("/transactions");

        setTxns(res.data.transactions);
        setUserId(res.data.userId);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          router.replace("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [router]);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-[#F6F7FB] px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm active:scale-95 transition"
            >
              ←
            </button>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Transactions
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Your recent payments & transfers
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && txns.length === 0 && (
            <div className="mt-24 text-center">
              <p className="text-sm text-gray-400">
                No transactions yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Your transfers will appear here
              </p>
            </div>
          )}

          {/* List */}
          {!loading && txns.length > 0 && (
            <div className="space-y-3">
              {txns.map((txn) => {
                const isCredit = txn.toId === userId;
                const otherUser = isCredit ? txn.from : txn.to;

                return (
                  <div
                    key={txn.id}
                    className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {isCredit
                          ? `Received from ${otherUser.firstName} ${otherUser.lastName}`
                          : `Sent to ${otherUser.firstName} ${otherUser.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(txn.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div
                      className={`text-base font-semibold ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}₹{txn.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && txns.length > 0 && (
            <p className="pt-6 text-center text-xs text-gray-400">
              Showing your latest transactions
            </p>
          )}
        </div>
      </main>
    </>
  );
}
