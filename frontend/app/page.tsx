"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4
                     bg-linear-to-br from-pink-100 via-indigo-100 to-emerald-100">

      {/* Color blobs */}
      <div className="absolute -top-32 -left-32 h-105 w-105 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="absolute top-40 -right-32 h-105 w-105 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 h-105 w-105 rounded-full bg-emerald-400/30 blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg rounded-4xl
                   bg-white/80 backdrop-blur-xl
                   shadow-2xl border border-white/60
                   px-8 py-10 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center
                     rounded-2xl bg-linear-to-tr from-pink-500 via-indigo-500 to-emerald-500
                     text-white text-2xl font-extrabold shadow-lg"
        >
          O
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-900">
          Om<span className="text-indigo-600">Pay</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-gray-600 leading-relaxed">
          Send money instantly with a splash of joy 💖  
          Fast • Secure • Built for modern payments
        </p>

        {/* Highlights */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-pink-100 text-pink-700 px-4 py-1">
            ⚡ Instant
          </span>
          <span className="rounded-full bg-indigo-100 text-indigo-700 px-4 py-1">
            🔐 Secure
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-700 px-4 py-1">
            💸 Simple
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/signup")}
            className="w-full rounded-xl py-3 text-lg font-semibold text-white
                       bg-linear-to-r from-pink-500 via-indigo-500 to-emerald-500
                       shadow-lg hover:shadow-xl transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/signin")}
            className="w-full rounded-xl py-3 text-lg font-medium
                       bg-white border border-gray-300 text-gray-800
                       hover:bg-gray-50 transition"
          >
            Sign In
          </motion.button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-gray-400">
          ✨ Trusted by users • Colorful by design • OmPay
        </p>
      </motion.div>
    </main>
  );
}
