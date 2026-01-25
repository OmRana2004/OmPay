"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  async function submit() {
    try {
      await api.post("/signup", form);
      router.push("/signin");
    } catch (e: any) {
      alert(e.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 border p-6 rounded space-y-3">
        <h2 className="text-xl font-bold">Create Account</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
