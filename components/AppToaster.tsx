"use client";

import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          minWidth: "320px",
          maxWidth: "320px",
          borderRadius: "18px",
          padding: "16px 24px",
          background: "#1f2937", // premium dark background
          color: "#f9fafb",
          fontWeight: 500,
          fontSize: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          backdropFilter: "blur(6px)",
        },
        success: {
          icon: "✅",
          style: { color: "#10b981" }, // green text for success
        },
        error: {
          icon: "❌",
          style: { color: "#ef4444" }, // red text for error
        },
        loading: {
          icon: "⏳",
          style: { color: "#3b82f6" }, // blue text for loading
        },
      }}
    />
  );
}

// Usage example with animation
export function showCustomToast(message: string, type: "success" | "error" | "loading" = "success") {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      style={{
        background: "#1f2937",
        color: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
        borderRadius: 18,
        padding: "16px 24px",
        minWidth: 320,
        maxWidth: 320,
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span>{type === "success" ? "✅" : type === "error" ? "❌" : "⏳"}</span>
      <span>{message}</span>
    </motion.div>
  ));
}
