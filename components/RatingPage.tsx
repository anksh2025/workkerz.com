"use client";

import React, { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function RatingPage() {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("कृपया स्टार रेटिंग चुनें।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit rating");
      }

      setSubmitted(true);
      toast.success("धन्यवाद! आपका रेटिंग सबमिट हो गया।");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="rating-form"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
          >
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Workkerz ऐप को रेट करें ⭐
            </h1>
            <p className="text-gray-500 mb-6">
              आपका फीडबैक हमें और बेहतर बनने में मदद करता है।
            </p>

            {/* Stars */}
            <div className="flex justify-center space-x-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Star
                    className={`w-12 h-12 cursor-pointer transition-colors ${
                      (hover || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "⏳ सबमिट हो रहा है..." : "सबमिट करें"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center"
          >
            <CheckCircle className="w-16 h-16 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-semibold text-center text-gray-800">
              धन्यवाद! 🎉
            </h2>
            <p className="mt-2 text-gray-600 text-center">
              आपका रेटिंग सफलतापूर्वक सबमिट हो गया।
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2 rounded-lg bg-sky-600 text-white font-medium shadow hover:bg-sky-700 transition"
            >
              वापस जाएं
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" richColors />
    </div>
  );
}
