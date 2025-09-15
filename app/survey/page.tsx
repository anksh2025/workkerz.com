"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft, ArrowRight, Eye, Star } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";
import RatingPage from "../../components/RatingPage";
import { useRouter } from "next/navigation";

/* ----------------- Types ----------------- */
type Option = { label: string; value: string };
type Lang = "hi" | "en";

/* ✅ Strict keys for translations */
type TranslationKey =
  | "personal_info"
  | "work_details"
  | "devices_payments"
  | "preferences"
  | "rating_review"
  | "next"
  | "back"
  | "preview_confirm"
  | "submitting"
  | "full_name"
  | "age"
  | "gender"
  | "location"
  | "mobile"
  | "bank_account"
  | "upi"
  | "work_type"
  | "find_work"
  | "work_frequency"
  | "comfortable_with_apps"
  | "smartphone"
  | "pay_fee"
  | "use_workkerz"
  | "payment_fraud"
  | "features"
  | "payment_method"
  | "register_now"
  | "rating";

/* ----------------- Translations ----------------- */
const translations: Record<TranslationKey, Record<Lang, string>> = {
  personal_info: { hi: "व्यक्तिगत जानकारी", en: "Personal Information" },
  work_details: { hi: "कार्य विवरण", en: "Work Details" },
  devices_payments: { hi: "डिवाइस और भुगतान", en: "Devices & Payments" },
  preferences: { hi: "प्राथमिकताएँ", en: "Preferences" },
  rating_review: { hi: "रेटिंग और समीक्षा", en: "Rating & Review" },

  next: { hi: "आगे", en: "Next" },
  back: { hi: "पीछे", en: "Back" },
  preview_confirm: { hi: "पूर्वावलोकन और पुष्टि", en: "Preview & Confirm" },
  submitting: { hi: "सबमिट हो रहा है...", en: "Submitting..." },

  full_name: { hi: "पूरा नाम", en: "Full Name" },
  age: { hi: "उम्र", en: "Age" },
  gender: { hi: "लिंग", en: "Gender" },
  location: { hi: "स्थान", en: "Location" },
  mobile: { hi: "मोबाइल नंबर", en: "Mobile Number" },
  bank_account: { hi: "बैंक खाता", en: "Bank Account" },
  upi: { hi: "UPI", en: "UPI" },
  work_type: { hi: "आप किस प्रकार का कार्य करते हैं?", en: "What type of work do you do?" },
  find_work: { hi: "आप वर्तमान में काम कैसे खोजते हैं?", en: "How do you currently find work?" },
  work_frequency: { hi: "आप कितने दिन काम करते हैं?", en: "How many days do you work?" },
  comfortable_with_apps: { hi: "क्या आप मोबाइल एप्स का उपयोग कर सकते हैं?", en: "Can you use mobile apps?" },
  smartphone: { hi: "क्या आपके पास स्मार्टफोन है?", en: "Do you have a smartphone?" },
  pay_fee: { hi: "क्या आप एप्लिकेशन के लिए शुल्क देने को तैयार हैं?", en: "Are you willing to pay for an app?" },
  use_workkerz: { hi: "क्या आप Workkerz ऐप का उपयोग करेंगे?", en: "Will you use the Workkerz app?" },
  payment_fraud: { hi: "क्या आपने भुगतान धोखाधड़ी का अनुभव किया है?", en: "Have you experienced payment fraud?" },
  features: { hi: "Workkerz ऐप में कौन-कौन सी सुविधाएँ देखना चाहेंगे?", en: "Which features would you like in the Workkerz app?" },
  payment_method: { hi: "आप किस प्रकार का भुगतान करना पसंद करेंगे?", en: "Preferred payment method?" },
  register_now: { hi: "क्या आप अभी पंजीकरण करना चाहेंगे?", en: "Would you like to register now?" },
  rating: { hi: "आप Workkerz ऐप को कितने स्टार देंगे?", en: "How many stars would you give the Workkerz app?" },
};

/* ----------------- Main Component ----------------- */
export default function MultiStepSurveyForm() {
  const [step, setStep] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hover, setHover] = useState<number>(0);
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const router = useRouter();

  const LOCAL_STORAGE_KEY = "workkerz_survey_draft_v1";
  const STEP_TITLES = [
    "personal_info",
    "work_details",
    "devices_payments",
    "preferences",
    "rating_review",
  ];

  const [form, setForm] = useState<Record<string, any>>({
    full_name: "",
    age: "",
    gender: "",
    location: "",
    mobile: "",
    bank_account: "",
    upi: "",
    work_type: [] as string[],
    find_work: [] as string[],
    work_frequency: "",
    comfortable_with_apps: "",
    biggest_problem: [] as string[],
    smartphone: "",
    pay_fee: "",
    use_workkerz: "",
    payment_fraud: "",
    features: [] as string[],
    payment_method: "",
    register_now: "",
  });

  /* ----------------- Load Draft ----------------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setForm(f => ({ ...f, ...JSON.parse(raw) }));
    } catch { }
  }, []);

  /* ----------------- Autosave ----------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
      } catch { }
    }, 500);
    return () => clearTimeout(t);
  }, [form]);

  const totalSteps = STEP_TITLES.length;

  function updateField<K extends string>(key: K, value: any) {
    setForm(s => ({ ...s, [key]: value }));
  }

  function toggleArrayField(key: string, value: string) {
    setForm(s => {
      const arr = Array.isArray(s[key]) ? [...s[key]] : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
      return { ...s, [key]: arr };
    });
  }

  function validateStep(idx: number) {
    if (idx === 0) {
      const required = ["full_name", "age", "gender", "location", "mobile", "bank_account", "upi"];
      for (const r of required) if (!form[r]) return r;
      if (String(form.mobile).length < 6) return "mobile";
    }
    if (idx === 1) {
      if (!form.work_type.length) return "work_type";
      if (!form.find_work.length) return "find_work";
      if (!form.work_frequency) return "work_frequency";
      if (!form.comfortable_with_apps) return "comfortable_with_apps";
    }
    if (idx === 2) {
      if (!form.smartphone) return "smartphone";
      if (!form.pay_fee) return "pay_fee";
      if (!form.use_workkerz) return "use_workkerz";
      if (!form.payment_fraud) return "payment_fraud";
    }
    if (idx === 3) {
      if (!form.features.length) return "features";
      if (!form.payment_method) return "payment_method";
      if (!form.register_now) return "register_now";
    }
    return null;
  }

  function handleNext() {
  const invalid = validateStep(step);
  if (invalid) {
    toast.error(
      `कृपया आवश्यक फ़ील्ड भरें: ${translations[invalid as TranslationKey][lang] || invalid}`
    );
    return;
  }
  setStep(s => Math.min(totalSteps - 1, s + 1));
}

  function handlePrev() {
    setStep(s => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        rating,
        work_type: JSON.stringify(form.work_type),
        find_work: JSON.stringify(form.find_work),
        features: JSON.stringify(form.features),
        biggest_problem: JSON.stringify(form.biggest_problem),
      };

      const { error } = await supabase.from("survey_responses").insert([payload]);
      if (error) throw error;

      setForm({
        full_name: "",
        age: "",
        gender: "",
        location: "",
        mobile: "",
        bank_account: "",
        upi: "",
        work_type: [],
        find_work: [],
        work_frequency: "",
        comfortable_with_apps: "",
        biggest_problem: [],
        smartphone: "",
        pay_fee: "",
        use_workkerz: "",
        payment_fraud: "",
        features: [],
        payment_method: "",
        register_now: "",
      });
      setRating(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSubmitted(true);
      setStep(0);
      setShowPreview(false);

      toast.success(lang === "hi" ? "धन्यवाद! आपका जवाब सफलतापूर्वक सबमिट हो गया।" : "Thank you! Your response has been submitted.");
    } catch (err: any) {
      console.error(err);
      toast.error(lang === "hi" ? "सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।" : "Error submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => router.push("/"), 4000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <CheckCircle className="mx-auto w-16 h-16 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-semibold">
          {lang === "hi" ? "धन्यवाद! Your response has been submitted." : "Thank you! Your response has been submitted."}
        </h2>
        <div className="mt-6">
          <RatingPage />
        </div>
        <p className="mt-4 text-sm text-gray-500">
          {lang === "hi" ? "Redirecting to home page shortly..." : "Redirecting to home page shortly..."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Language Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button type="button" className={`px-3 py-1 rounded ${lang === "hi" ? "bg-sky-600 text-white" : "bg-gray-200"}`} onClick={() => setLang("hi")}>हिंदी</button>
        <button type="button" className={`px-3 py-1 rounded ${lang === "en" ? "bg-sky-600 text-white" : "bg-gray-200"}`} onClick={() => setLang("en")}>English</button>
      </div>

      <form className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-slate-500">
              {translations[STEP_TITLES[step] as TranslationKey][lang]}
            </h3>
            <h2 className="text-xl font-semibold">
              {lang === "hi"
                ? `Step ${step + 1} of ${totalSteps}`
                : `Step ${step + 1} of ${totalSteps}`}
            </h2>
          </div>
          <div className="w-44">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${Math.round(((step + 1) / totalSteps) * 100)}%` }}
              />
            </div>
          </div>
        </div>


        <AnimatePresence mode="wait">
          {/* ------------------- Step 0 ------------------- */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <InputField label={`Q1. ${translations.full_name[lang]}`}>
                <input
                  value={form.full_name}
                  onChange={e => updateField("full_name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                  placeholder={lang === "hi" ? "पूरा नाम दर्ज करें" : "Enter full name"}
                />
              </InputField>

              <InputField label={`Q2. ${translations.age[lang]}`}>
                <select
                  value={form.age}
                  onChange={e => updateField("age", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                >
                  <option value="">{lang === "hi" ? "उम्र चुनें" : "Select age"}</option>
                  <option value="18-25">18–25</option>
                  <option value="26-35">26–35</option>
                  <option value="36-45">36–45</option>
                  <option value="46-55">46–55</option>
                  <option value="55+">55+</option>
                </select>
              </InputField>

              <InputField label={`Q3. ${translations.gender[lang]}`}>
                <RadioGroup
                  name="gender"
                  value={form.gender}
                  onChange={(v: string) => updateField("gender", v)}
                  options={[
                    { label: lang === "hi" ? "पुरुष" : "Male", value: "male" },
                    { label: lang === "hi" ? "महिला" : "Female", value: "female" },
                    { label: lang === "hi" ? "अन्य" : "Other", value: "other" },
                  ]}
                />
              </InputField>

              <InputField label={`Q4. ${translations.location[lang]}`}>
                <input
                  value={form.location}
                  onChange={e => updateField("location", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                  placeholder={lang === "hi" ? "शहर/पता" : "City/Address"}
                />
              </InputField>

              <InputField label={`Q5. ${translations.mobile[lang]}`}>
                <input
                  value={form.mobile}
                  onChange={e => updateField("mobile", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                  placeholder={lang === "hi" ? "मोबाइल नंबर" : "Mobile number"}
                />
              </InputField>

              <InputField label={`Q6. ${translations.bank_account[lang]}`}>
                <RadioGroup
                  name="bank_account"
                  value={form.bank_account}
                  onChange={(v: string) => updateField("bank_account", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>

              <InputField label={`Q7. ${translations.upi[lang]}`}>
                <RadioGroup
                  name="upi"
                  value={form.upi}
                  onChange={(v: string) => updateField("upi", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>
            </motion.div>
          )}

          {/* ------------------- Step 1 ------------------- */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <InputField label={`Q8. ${translations.work_type[lang]}`}>
                <CheckboxGroup
                  options={lang === "hi" ? ["निर्माण", "सफाई", "ड्राइवर", "ऑफिस वर्क"] : ["Construction", "Cleaning", "Driver", "Office Work"]}
                  values={form.work_type}
                  onChange={(v: string) => toggleArrayField("work_type", v)}
                />
              </InputField>

              <InputField label={`Q9. ${translations.find_work[lang]}`}>
                <CheckboxGroup
                  options={lang === "hi" ? ["सड़क पर", "ऑनलाइन प्लेटफॉर्म", "नौकरशाही", "परिवार/मित्र"] : ["Street", "Online Platforms", "Government Jobs", "Family/Friends"]}
                  values={form.find_work}
                  onChange={(v: string) => toggleArrayField("find_work", v)}
                />
              </InputField>

              <InputField label={`Q10. ${translations.work_frequency[lang]}`}>
                <RadioGroup
                  name="work_frequency"
                  value={form.work_frequency}
                  onChange={(v: string) => updateField("work_frequency", v)}
                  options={lang === "hi"
                    ? [
                      { label: "सप्ताह में 1–2 दिन", value: "1-2" },
                      { label: "सप्ताह में 3–4 दिन", value: "3-4" },
                      { label: "सप्ताह में 5–6 दिन", value: "5-6" },
                      { label: "सप्ताह में 7 दिन", value: "7" },
                    ]
                    : [
                      { label: "1–2 days/week", value: "1-2" },
                      { label: "3–4 days/week", value: "3-4" },
                      { label: "5–6 days/week", value: "5-6" },
                      { label: "7 days/week", value: "7" },
                    ]
                  }
                />
              </InputField>

              <InputField label={`Q11. ${translations.comfortable_with_apps[lang]}`}>
                <RadioGroup
                  name="comfortable_with_apps"
                  value={form.comfortable_with_apps}
                  onChange={(v: string) => updateField("comfortable_with_apps", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>
            </motion.div>
          )}

          {/* ------------------- Step 2 ------------------- */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <InputField label={`Q12. ${translations.smartphone[lang]}`}>
                <RadioGroup
                  name="smartphone"
                  value={form.smartphone}
                  onChange={(v: string) => updateField("smartphone", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>

              <InputField label={`Q13. ${translations.pay_fee[lang]}`}>
                <RadioGroup
                  name="pay_fee"
                  value={form.pay_fee}
                  onChange={(v: string) => updateField("pay_fee", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>

              <InputField label={`Q14. ${translations.use_workkerz[lang]}`}>
                <RadioGroup
                  name="use_workkerz"
                  value={form.use_workkerz}
                  onChange={(v: string) => updateField("use_workkerz", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>

              <InputField label={`Q15. ${translations.payment_fraud[lang]}`}>
                <RadioGroup
                  name="payment_fraud"
                  value={form.payment_fraud}
                  onChange={(v: string) => updateField("payment_fraud", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>
            </motion.div>
          )}

          {/* ------------------- Step 3 ------------------- */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <InputField label={`Q16. ${translations.features[lang]}`}>
                <CheckboxGroup
                  options={lang === "hi" ? ["काम खोज", "भुगतान", "समीक्षा", "रोज़गार सुरक्षा"] : ["Job Search", "Payments", "Reviews", "Employment Security"]}
                  values={form.features}
                  onChange={(v: string) => toggleArrayField("features", v)}
                />
              </InputField>

              <InputField label={`Q17. ${translations.payment_method[lang]}`}>
                <RadioGroup
                  name="payment_method"
                  value={form.payment_method}
                  onChange={(v: string) => updateField("payment_method", v)}
                  options={lang === "hi"
                    ? [
                      { label: "नकद", value: "cash" },
                      { label: "UPI", value: "upi" },
                      { label: "बैंक ट्रांसफर", value: "bank" },
                    ]
                    : [
                      { label: "Cash", value: "cash" },
                      { label: "UPI", value: "upi" },
                      { label: "Bank Transfer", value: "bank" },
                    ]
                  }
                />
              </InputField>

              <InputField label={`Q18. ${translations.register_now[lang]}`}>
                <RadioGroup
                  name="register_now"
                  value={form.register_now}
                  onChange={(v: string) => updateField("register_now", v)}
                  options={[
                    { label: lang === "hi" ? "हाँ" : "Yes", value: "yes" },
                    { label: lang === "hi" ? "नहीं" : "No", value: "no" },
                  ]}
                />
              </InputField>
            </motion.div>
          )}
        </AnimatePresence>



        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={handlePrev} disabled={step === 0} className={`px-4 py-2 rounded-lg border ${step === 0 ? "opacity-40 cursor-not-allowed" : ""}`}>
            <ArrowLeft className="w-4 h-4 inline" /> {translations.back[lang]}
          </button>

          {step < totalSteps - 1 ? (
            <button type="button" onClick={handleNext} className="px-4 py-2 rounded-lg bg-sky-600 text-white">
              {translations.next[lang]} <ArrowRight className="w-4 h-4 inline" />
            </button>
          ) : (
            <button type="button" onClick={() => setShowPreview(true)} className="px-4 py-2 rounded-lg bg-purple-600 text-white">
              <Eye className="w-4 h-4 inline" /> {translations.preview_confirm[lang]}
            </button>
          )}
        </div>
      </form>

      {showPreview && <SurveyPreview form={form} rating={rating} onClose={() => setShowPreview(false)} onConfirm={handleSubmit} submitting={submitting} lang={lang} />}
    </div>
  );
}

/* ----------------- Preview Modal ----------------- */
function SurveyPreview({
  form,
  rating,
  onClose,
  onConfirm,
  submitting,
  lang,
}: {
  form: Record<TranslationKey, any>;
  rating: number | null;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  lang: Lang;
}) {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl max-w-3xl w-full p-6 border border-white/30">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">{lang === "hi" ? "पूर्वावलोकन" : "Preview Your Answers"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">✖</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {Object.entries(form).map(([k, v]) => {
            const key = k as TranslationKey; // <-- Safe type assertion
            return (
              <div key={k} className="flex justify-between items-start bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow hover:shadow-md transition-shadow border border-white/20">
                <div className="text-sm text-gray-600 font-medium">{translations[key]?.[lang] || k}</div>
                <div className="text-sm text-gray-800 font-semibold">{Array.isArray(v) ? v.join(", ") : String(v)}</div>
              </div>
            );
          })}
        </div>

        <label className="flex items-center mt-5 gap-3">
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400" />
          <span className="text-gray-700 font-medium text-sm">{lang === "hi" ? "मैं पुष्टि करता हूँ कि सभी उत्तर सही हैं।" : "I confirm that all my answers are correct."}</span>
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold transition-colors">{lang === "hi" ? "संपादित करें" : "Edit"}</button>
          {checked && (
            <button type="button" onClick={onConfirm} disabled={submitting} className={`px-5 py-2 rounded-xl text-white font-semibold shadow-lg transition-colors ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
              {submitting ? translations.submitting[lang] : lang === "hi" ? "पुष्टि और सबमिट" : "Confirm & Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------- Input Helpers ----------------- */
function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((o: Option) => (
        <label key={o.value} className="inline-flex items-center gap-2">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="w-4 h-4" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, values, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((o: string) => (
        <label key={o} className="inline-flex items-center gap-2">
          <input type="checkbox" value={o} checked={values.includes(o)} onChange={() => onChange(o)} className="w-4 h-4" />
          {o}
        </label>
      ))}
    </div>
  );
}
