"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {ArrowLeft, ArrowRight, Eye, Star } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";
import RatingPage from "../../components/RatingPage";
import { useRouter } from "next/navigation";
import StepTracker from "../../components/StepTracker";
import { InputField, RadioGroup, CheckboxGroup } from "../../components/InputHelpers";

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
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);


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
    smartphone: "",
    biggest_problem: [] as string[],
    use_workkerz: "",
    payment_fraud: "",
    features: [] as string[],
    payment_method: "",
    register_now: "",
  });


  useEffect(() => {
    const currentStepEl = stepRefs.current[step];
    if (currentStepEl && scrollContainerRef.current) {
      currentStepEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [step]);

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

  // ✅ Validation logic
  function validateStep(idx: number) {
    if (idx === 0) {
      const required = [
        "full_name",
        "age",
        "gender",
        "location",
        "mobile",
        "bank_account",
      ];
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

  // ✅ Step click handler
  function handleStepClick(i: number) {
    const invalid = validateStep(step);
    if (i > step && invalid) {
      alert(`Please fill the field: ${invalid}`);
      return;
    }
    setStep(i);
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
      // 1️⃣ Check if the same user already submitted
      const { data: existing, error: fetchError } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("full_name", form.full_name)
        .eq("mobile", form.mobile)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        toast.error(lang === "hi" ? "⚠️ सर्वेक्षण पहले ही सबमिट किया जा चुका है।" : "⚠️ Survey already submitted with this name and number.");
        setSubmitting(false);
        return;
      }

      // 2️⃣ Insert new response
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

      // 3️⃣ Reset form & show success
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
        smartphone: "",
        biggest_problem: [],
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
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-5">
      {/* Topbar (Mobile) */}
      <div className="md:hidden">
        <StepTracker
          step={step}
          stepTitles={STEP_TITLES.map(k => translations[k as TranslationKey][lang])}
          onStepClick={handleStepClick}
          lang={lang}
        />
      </div>
      {/* Sidebar (Step Tracker) */}
      <aside className="hidden md:block">
        <StepTracker
          step={step}
          stepTitles={STEP_TITLES.map(k => translations[k as TranslationKey][lang])}
          onStepClick={handleStepClick}
          lang={lang}
        />
      </aside>

      <main className="flex-1 bg-white rounded-xl shadow p-6">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex bg-gray-100 rounded-full shadow-md p-1 gap-1 w-max">
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
      ${lang === "hi"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-200 focus:bg-gray-300"
                }`}
            >
              हिंदी
            </button>

            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
      ${lang === "en"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-200 focus:bg-gray-300"
                }`}
            >
              English
            </button>
          </div>

        </div>

        <form className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            {/* Step Titles */}
            <div>
              <h3 className="text-sm text-slate-500 tracking-wide">
                {translations[STEP_TITLES[step] as TranslationKey][lang]}
              </h3>
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 mt-1">
                {lang === "hi"
                  ? `स्टेप्स  ${step + 1} / ${totalSteps}`
                  : `Step ${step + 1} of ${totalSteps}`}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="w-48">
              <div className="h-3 bg-slate-200 rounded-full relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.round(((step + 1) / totalSteps) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-right">
                {Math.round(((step + 1) / totalSteps) * 100)}%
              </p>
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
                className="space-y-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8"
              >
                {/* Q1: Full Name */}
                <InputField label={`Q1. ${translations.full_name[lang]}`}>
                  <input
                    value={form.full_name}
                    onChange={e => updateField("full_name", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition shadow-sm hover:shadow"
                    placeholder={lang === "hi" ? "पूरा नाम दर्ज करें" : "Enter full name"}
                  />
                </InputField>

                {/* Q2: Age */}
                <InputField label={`Q2. ${translations.age[lang]}`}>
                  <select
                    value={form.age}
                    onChange={e => updateField("age", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition shadow-sm hover:shadow"
                  >
                    <option value="">{lang === "hi" ? "उम्र चुनें" : "Select age"}</option>
                    <option value="18-25">18–25</option>
                    <option value="26-35">26–35</option>
                    <option value="36-45">36–45</option>
                    <option value="46-55">46–55</option>
                    <option value="55+">55+</option>
                  </select>
                </InputField>

                {/* Q3: Gender */}
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

                {/* Q4: Location */}
                <InputField label={`Q4. ${translations.location[lang]}`}>
                  <select
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2  transition shadow-sm hover:shadow bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-900"
                  >
                    <option value="">{lang === "hi" ? "शहर/पता चुनें" : "Select City/Location"}</option>
                    <option value="karond">Karond</option>
                    <option value="lalgati">Lalgati</option>
                    <option value="anand nagar">Anand Nagar</option>
                    <option value="bairagarh">Bairagarh</option>
                    <option value="nehru nagar">Nehru Nagar</option>
                    <option value="ashoka garden">Ashoka Garden</option>
                    <option value="durga mata mandir">Durga Mata Mandir</option>
                  </select>
                </InputField>


                {/* Q5: Mobile */}
                <InputField label={`Q5. ${translations.mobile[lang]}`}>
                  <input
                    value={form.mobile}
                    onChange={e => updateField("mobile", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition shadow-sm hover:shadow"
                    placeholder={lang === "hi" ? "मोबाइल नंबर" : "Mobile number"}
                  />
                </InputField>

                {/* Q6: Bank Account */}
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
                <InputField label={`Q8. ${translations.work_type[lang]}`}>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "hi"
                      ? ["निर्माण", "सफाई", "ड्राइवर", "ऑफिस वर्क", "सुरक्षा", "खान-पान", "अन्य"]
                      : ["Construction", "Cleaning", "Driver", "Office Work", "Security", "Catering", "Other"]
                    ).map((option) => {
                      const selected = form.work_type.includes(option);
                      return (
                        <span
                          key={option}
                          onClick={() => toggleArrayField("work_type", option)}
                          className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none
            ${selected
                              ? "bg-sky-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
          `}
                        >
                          {option}
                        </span>
                      );
                    })}
                  </div>
                </InputField>

                <InputField label={`Q9. ${translations.find_work[lang]}`}>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "hi"
                      ? ["चौराहा", "ऑनलाइन प्लेटफॉर्म", "नौकरशाही", "परिवार/मित्र"]
                      : ["Street chauraha", "Online Platforms", "Government Jobs", "Family/Friends"]
                    ).map((option) => {
                      const selected = form.find_work.includes(option);
                      return (
                        <span
                          key={option}
                          onClick={() => toggleArrayField("find_work", option)}
                          className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none
            ${selected
                              ? "bg-sky-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
          `}
                        >
                          {option}
                        </span>
                      );
                    })}
                  </div>
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

                <InputField label={`Q5. ${lang === "hi"
                  ? "रोज़गार पाने में आपको सबसे बड़ी समस्या क्या है"
                  : "What is the biggest problem you face in finding work?"}`}>
                  <RadioGroup
                    name="biggest_problem"
                    value={form.biggest_problem}
                    onChange={(v: string) => updateField("biggest_problem", v)}
                    options={[
                      { label: lang === "hi" ? "काम नहीं मिलता" : "No work available", value: "no_work" },
                      { label: lang === "hi" ? "बहुत कम दिहाड़ी मिलती है" : "Very low wages", value: "low_wages" },
                      { label: lang === "hi" ? "काम के लिए बहुत भीड़/प्रतिस्पर्धा" : "Too much competition for work", value: "competition" },
                      { label: lang === "hi" ? "मज़दूरी समय पर नहीं मिलती" : "Delayed or no payment", value: "no_payment" },
                      { label: lang === "hi" ? "ठेकेदार द्वारा शोषण" : "Exploitation by contractors", value: "exploitation" },
                      { label: lang === "hi" ? "अन्य" : "Other", value: "other" },
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
      </main>
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
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting || !checked}
            className={`px-5 py-2 rounded-xl text-white font-semibold shadow-lg transition-colors ${submitting || !checked ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {submitting ? translations.submitting[lang] : lang === "hi" ? "पुष्टि और सबमिट" : "Confirm & Submit"}
          </button>

        </div>
      </div>
    </div>
  );
}

