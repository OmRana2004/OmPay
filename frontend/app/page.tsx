"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4
                     bg-[#F6F7FB]">

      {/* Soft background glows */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm px-6 py-8 text-center">

          {/* Logo */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center
                          rounded-2xl bg-gray-900 text-white text-xl font-semibold shadow-md">
            O
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900">
            OmPay
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Simple, fast and secure payments for everyday use.
          </p>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl bg-gray-900 py-3.5
                         text-white text-base font-medium
                         hover:bg-gray-800 transition
                         active:scale-[0.98]"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("/signin")}
              className="w-full rounded-xl border border-gray-200 py-3.5
                         text-gray-900 text-base font-medium bg-white
                         hover:bg-gray-100 transition
                         active:scale-[0.98]"
            >
              Sign In
            </button>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-xs text-gray-400">
            Bank-grade security • Instant transfers
          </p>
        </div>
      </motion.div>
    </main>
  );
}
