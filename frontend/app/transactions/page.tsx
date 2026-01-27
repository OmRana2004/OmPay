"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Navbar from "../../components/Navbar";

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

function TransactionSkeleton() {
  return (
    
    <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-20 bg-gray-200 rounded" />
    </div>
  );
}

export default function Transactions() {
  const router = useRouter();
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await api.get("/transactions");

        setTxns(res.data.transactions || []);
        setUserId(res.data.userId || null);
      } catch (err: any) {
        // ❌ Cookie missing / expired
        if (err?.response?.status === 401) {
          router.replace("/signin");
        }
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [router]);

  return (
    <>
    <Navbar />
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Transactions
        </h1>

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
          <div className="text-center text-gray-400 mt-24">
            No transactions yet
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
                  {/* LEFT */}
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {isCredit
                        ? `Received from ${otherUser.firstName} ${otherUser.lastName}`
                        : `Sent to ${otherUser.firstName} ${otherUser.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500">
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

                  {/* RIGHT */}
                  <div
                    className={`text-lg font-semibold ${
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

        {/* Footer */}
        {!loading && txns.length > 0 && (
          <p className="mt-10 text-center text-xs text-gray-400">
            Showing your recent transactions
          </p>
        )}
      </div>
    </div>
    </>
  );
}
