"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { simulateQrLogin } from "@/data/mockApi";

export default function QRLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");

  useEffect(() => {
    const token = localStorage.getItem("mart_auth_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleScan = async () => {
    setStatus("scanning");
    const login = await simulateQrLogin();
    localStorage.setItem("mart_auth_token", login.token);
    localStorage.setItem("mart_user_id", login.user.id);
    setStatus("success");
    window.setTimeout(() => {
      router.replace("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen px-4 py-12 flex items-center">
      <div className="w-full max-w-md mx-auto space-y-4">
        <section className="surface-card p-6 text-center bg-gradient-to-b from-white to-[#f3fbf6]">
          <p className="text-xs uppercase tracking-[0.16em] text-[#27ae60] font-semibold">
            QR Login Screen
          </p>
          <h1 className="text-2xl font-black mt-2 text-[#1e1e1e]">
            Scan to sign in
          </h1>
          <p className="text-sm text-[#7f8c8d] mt-1">
            Mock flow: token generation and auto login.
          </p>

          <div className="mt-5 mx-auto h-44 w-44 rounded-2xl border-2 border-dashed border-[#cdeedd] bg-white grid place-items-center">
            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-16 w-16 rounded-full bg-[#2ecc71] text-white grid place-items-center text-3xl"
              >
                ?
              </motion.div>
            ) : (
              <div className="h-24 w-24 bg-[linear-gradient(90deg,#111_25%,transparent_25%,transparent_50%,#111_50%,#111_75%,transparent_75%)] bg-[length:16px_16px] opacity-80" />
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={status === "scanning" || status === "success"}
            className="btn-primary w-full mt-5 py-2.5 text-sm"
          >
            {status === "idle" && "Scan QR"}
            {status === "scanning" && "Scanning..."}
            {status === "success" && "Login Success"}
          </button>
        </section>
      </div>
    </div>
  );
}
