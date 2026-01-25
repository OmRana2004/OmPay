"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-white text-2xl font-bold shadow-sm"
        >
          O
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-gray-900">
          OmPay
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-500 leading-relaxed">
          Simple, fast and secure way to send and receive money.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signup")}
            className="w-full rounded-xl bg-gray-900 py-3 text-white text-lg font-medium transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signin")}
            className="w-full rounded-xl border border-gray-300 py-3 text-gray-800 text-lg font-medium bg-white transition"
          >
            Sign In
          </motion.button>
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-xs text-gray-400"
        >
          Trusted • Secure • Built for simplicity
        </motion.p>
      </motion.div>
    </main>
  );
}
