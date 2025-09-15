"use client";

import React, { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

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
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      setSubmitted(true);
      toast.success("धन्यवाद! आपका रेटिंग सबमिट हो गया।");
    } catch (err) {
      console.error(err);
      toast.error("सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <CheckCircle className="w-16 h-16 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-semibold text-center">
          धन्यवाद! आपका रेटिंग सबमिट हो गया।
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Workkerz ऐप को रेट करें</h1>

      <div className="flex space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-10 h-10 cursor-pointer transition-colors ${
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>

      <Toaster position="top-right" richColors />
    </div>
  );
}
