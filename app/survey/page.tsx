"use client";

import { useState } from "react";
import { Field, Radio, CheckboxGroup } from "../../components";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Survey() {
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // ✅ Handle Survey Submit
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: any = Object.fromEntries(fd.entries());
    data.q6 = fd.getAll("q6");
    data.q7 = fd.getAll("q7");

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setDone(true);
        form.reset();
        toast.success("🎉 Survey submitted successfully!");
      } else {
        const j = await res.json().catch(() => ({ error: "Failed" }));
        setErr(j.error || "Failed");
        toast.error(j.error || "Failed to submit survey");
      }
    } catch {
      setErr("Network error, please try again.");
      toast.error("🌐 Network error, please try again.");
    }

    setLoading(false);
  }

  // ✅ Save Rating
  const handleSaveRating = async (value: number) => {
    setRating(value);
    const { error } = await supabase.from("ratings").insert([{ rating: value }]);
    if (!error) {
      setRatingSubmitted(true);
      toast.success("🌟 Thanks for your rating!");
    } else {
      toast.error("Failed to save rating");
    }
  };

  // ✅ After survey submitted → show thank you + rating
  if (done)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto max-w-lg bg-white shadow-xl rounded-2xl p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-green-600">
            धन्यवाद! / Thank you 🎉
          </h2>
          <p className="mt-3 text-gray-600">
            Your survey is submitted. Our team will reach out soon.
          </p>

          {/* ✅ Rating Section */}
          {!ratingSubmitted ? (
            <div className="mt-6 bg-green-50 rounded-xl p-6 shadow-inner">
              <p className="text-green-800 mb-3 font-medium">
                Rate your experience:
              </p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    className={`cursor-pointer transition ${
                      star <= rating
                        ? "fill-green-600 text-green-600"
                        : "text-green-300"
                    }`}
                    onClick={() => handleSaveRating(star)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-green-700 font-semibold">
              🌟 Thanks for your feedback!
            </p>
          )}

          <a
            href="/"
            className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Go Home
          </a>
        </motion.div>
      </div>
    );

  // ✅ Survey form before submission
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Workkerz.com Worker Pre-Use Survey
          </h1>
          <p className="mt-2 text-gray-500">
            (कामगार सर्वे) — Please answer a few questions to help us serve you
            better.
          </p>
        </div>

        {/* Error (inline, optional) */}
        {err && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-center">
            {err}
          </div>
        )}

        {/* Survey Form */}
        <form onSubmit={onSubmit} className="mt-8 grid gap-8">
          {/* Section 1 */}
          <div className="space-y-6">
            <Field label="Q1. Full Name (पूरा नाम)" required>
              <input
                name="full_name"
                className="input"
                placeholder="Your name"
                required
              />
            </Field>
            <Field label="Q2. Phone Number (फ़ोन नंबर)" required>
              <input
                name="phone"
                className="input"
                placeholder="10 digits"
                pattern="\d{10}"
                required
              />
            </Field>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Section 2 */}
          <div className="space-y-6">
            <Field
              label="Q3. How do you currently find work? (काम कैसे ढूँढते हैं?)"
              required
            >
              <Radio
                required
                name="q3"
                options={[
                  {
                    label: "Daily labor stand / street corner (मज़दूर चौक)",
                    value: "street",
                  },
                  { label: "Contractor / middleman (ठेकेदार / दलाल)", value: "contractor" },
                  { label: "Reference from friends (दोस्तों की सिफ़ारिश)", value: "friends" },
                  { label: "Apps / Agencies (ऐप्स / एजेंसियाँ)", value: "apps" },
                ]}
              />
            </Field>
            <Field
              label="Q4. How often do you get work in a week? (एक हफ़्ते में कितनी बार काम?)"
              required
            >
              <Radio
                required
                name="q4"
                options={[
                  { label: "Daily (रोज़ाना)", value: "daily" },
                  { label: "3–4 times a week (३–४ बार)", value: "3-4" },
                  { label: "Rarely (कभी-कभार)", value: "rare" },
                ]}
              />
            </Field>
            <Field
              label="Q5. Are you comfortable using apps for finding work? (क्या आप ऐप्स इस्तेमाल करने में सहज हैं?)"
              required
            >
              <Radio
                required
                name="q5"
                options={[
                  { label: "Yes (हाँ)", value: "yes" },
                  { label: "No, need training (नहीं, प्रशिक्षण चाहिए)", value: "need training" },
                ]}
              />
            </Field>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Section 3 */}
          <div className="space-y-6">
            <Field label="Q6. Problems in getting work? (समस्या) — multiple select">
              <CheckboxGroup
                name="q6"
                options={[
                  { label: "No regular customers (नियमित ग्राहक नहीं)", value: "no-customers" },
                  { label: "Middlemen cut commission (कमीशन कटता है)", value: "commission" },
                  { label: "Late or unpaid wages (देर/नहीं मिलती)", value: "wages" },
                  { label: "No trust/safety (विश्वास/सुरक्षा)", value: "trust" },
                ]}
              />
            </Field>
            <Field label="Q7. What would you like Workkerz.com to provide? (आप क्या चाहते हैं?) — multiple select">
              <CheckboxGroup
                name="q7"
                options={[
                  { label: "Regular job opportunities (नियमित काम)", value: "regular-jobs" },
                  { label: "On-time payments (समय पर भुगतान)", value: "on-time-payments" },
                  { label: "Verified & safe customers (सत्यापित ग्राहक)", value: "verified-customers" },
                  { label: "Training for better jobs (प्रशिक्षण)", value: "training" },
                  { label: "Insurance or safety support (बीमा/सुरक्षा)", value: "insurance" },
                ]}
              />
            </Field>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Section 4 */}
          <div className="space-y-6">
            <Field label="Q8. Preferred payment method (भुगतान का तरीका)" required>
              <Radio
                required
                name="q8"
                options={[
                  { label: "Cash (नकद)", value: "cash" },
                  { label: "Direct bank transfer (सीधा बैंक)", value: "bank" },
                  { label: "UPI (यूपीआई)", value: "upi" },
                ]}
              />
            </Field>
            <Field label="Q9. Do you have a smartphone? (स्मार्टफोन)" required>
              <Radio
                required
                name="q9"
                options={[
                  { label: "Yes (हाँ)", value: "yes" },
                  { label: "No (नहीं, परिवार के पास है)", value: "no" },
                ]}
              />
            </Field>
            <Field label="Q10. Comfortable using apps? (ऐप्स इस्तेमाल करने में सहज?)" required>
              <Radio
                required
                name="q10"
                options={[
                  { label: "Yes (हाँ)", value: "yes" },
                  { label: "No, need training (प्रशिक्षण चाहिए)", value: "need-training" },
                ]}
              />
            </Field>
            <Field label="Q11. Would you pay a small fee for verified customers & on-time payments?" required>
              <Radio
                required
                name="q11"
                options={[
                  { label: "Yes (हाँ)", value: "yes" },
                  { label: "Maybe (शायद)", value: "maybe" },
                  { label: "No (नहीं)", value: "no" },
                ]}
              />
            </Field>
          </div>

          {/* Submit */}
          <div className="pt-4 text-center">
            <button
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-xl shadow transition"
            >
              {loading ? "Submitting…" : "🚀 Submit Survey"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
