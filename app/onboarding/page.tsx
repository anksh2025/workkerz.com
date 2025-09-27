"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import clsx from "clsx";
import { Toaster, toast } from "sonner";
import WorkerIdCard from "../../components/WorkerIdCard";
import { Images, SwitchCamera } from "lucide-react";
import { Listbox } from "@headlessui/react";

function generateWorkerCode() {
  return "Wrk" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Basic Info", "Skills", "ID Card"];
  return (
    <div className="flex justify-center mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold",
              step === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
            )}
          >
            {i + 1}
          </div>
          {i < steps.length - 1 && <div className="w-12 h-1 bg-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );
}

const SKILL_OPTIONS = [
  { label: "Plumber / प्लम्बर", value: "plumber", icon: "🔧" },
  { label: "Electrician / इलेक्ट्रीशियन", value: "electrician", icon: "⚡" },
  { label: "Carpenter / बढ़ई", value: "carpenter", icon: "🔨" },
  { label: "Painter / पेंटर", value: "painter", icon: "🎨" },
  { label: "Cleaner / सफाईकर्मी", value: "cleaner", icon: "🧹" },
  { label: "Cook / रसोइया", value: "cook", icon: "🍳" },
  { label: "Driver / चालक", value: "driver", icon: "🚗" },
  { label: "Gardener / माली", value: "gardener", icon: "🌱" },
  { label: "AC Technician", value: "ac_technician", icon: "❄️" },
  { label: "Appliance Repair", value: "appliance_repair", icon: "🛠️" },
];

function CheckboxGroup({ options, value, onChange }: any) {
  const toggle = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((x: string) => x !== val) : [...value, val]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((o: any) => (
        <motion.button
          whileTap={{ scale: 0.95 }}
          key={o.value}
          type="button"
          onClick={() => toggle(o.value)}
          className={clsx(
            "flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-md transition-all duration-300",
            value.includes(o.value)
              ? "border-indigo-600 bg-indigo-50 scale-105 shadow-lg"
              : "border-gray-200 hover:border-indigo-300 hover:shadow"
          )}
        >
          <span className="text-4xl mb-2">{o.icon}</span>
          <span className="font-semibold">{o.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

const DURATION_OPTIONS = [
  { value: "per_day", label: "Per Day" },
  { value: "per_week", label: "Per Week" },
  { value: "per_month", label: "Per Month" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [workerCode, setWorkerCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    phone: "",
    full_name: "",
    email: "",
    address: "",
    payment: "",
    durationType: "",
    dob: "",
    photoUrl: "",
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"Worker" | "Contractor" | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const CONTRACTOR_SUBCATEGORIES = ["Builder", "Supplier", "Service Provider"];

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBasicSubmit = () => {
    const newErrors: any = {};
    if (!form.full_name) newErrors.full_name = "Required";
    if (!form.phone || form.phone.length !== 10) newErrors.phone = "10 digits";
    if (!form.dob) newErrors.dob = "Required";
    if (!form.address) newErrors.address = "Required";
    if (!form.payment) newErrors.payment = "Required";
    if (!form.durationType) newErrors.durationType = "Required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix errors");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
  if (!selectedCategory) {
    toast.error("Please select Worker or Contractor");
    return;
  }

  if (selectedCategory === "Worker" && selectedSkills.length === 0) {
    toast.error("Select at least one skill");
    return;
  }

  if (selectedCategory === "Contractor" && !selectedSubCategory) {
    toast.error("Please select a sub-category");
    return;
  }

  const code = generateWorkerCode();

  // Build payload
  const payload = {
    phone: form.phone,
    full_name: form.full_name,
    email: form.email,
    address: form.address,
    expected_payment: form.payment,
    duration_type: form.durationType,
    dob: form.dob,
    photo_url: form.photoUrl,
    worker_code: code,
    category: selectedCategory,                // "Worker" or "Contractor"
    sub_category: selectedSubCategory,         // only for Contractor
    skills: selectedCategory === "Worker" ? selectedSkills : [], // only for Worker
  };

  const { error: insertError } = await supabase.from("workers").insert([payload]);

  if (insertError) {
    console.error(insertError);
    toast.error("Submit failed: " + insertError.message);
    return;
  }

  setWorkerCode(code);
  setStep(3);
  toast.success("Worker onboarded successfully!");
};


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-pink-100 overflow-hidden">
      <Toaster position="top-right" richColors expand />

      {/* floating blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
      >
        <StepIndicator step={step} />

        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h1 className="text-2xl font-bold text-center text-gray-800">👷 Worker Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="relative">
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-500"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                  Full Name *
                </label>
                {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-500"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base">
                  Phone Number *
                </label>
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              {/* DOB */}
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-500"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm">Date of Birth *</label>
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
              </div>

              {/* Photo Upload */}
              <div className="relative md:col-span-2 flex flex-col items-center">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full overflow-hidden mb-4 flex items-center justify-center bg-gray-50 relative">
                  {form.photoUrl ? (
                    // note: data URL is okay to preview; consider uploading to storage for production
                    // and saving URL instead of data URL
                    // but we keep as-is per your current flow
                    <img src={form.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-center text-sm">Upload Photo</span>
                  )}
                </div>

                <div className="flex gap-4">
                  {/* Gallery */}
                  <label className="flex items-center justify-center w-14 h-14 bg-indigo-50 hover:bg-indigo-100 rounded-full shadow-sm cursor-pointer transition">
                    <Images />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setForm({ ...form, photoUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Camera */}
                  <label className="flex items-center justify-center w-14 h-14 bg-green-50 hover:bg-green-100 rounded-full shadow-sm cursor-pointer transition">
                    <SwitchCamera />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setForm({ ...form, photoUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Address */}
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder=" "
                  className={clsx(
                    "peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-500",
                    errors.address && "border-red-500 focus:border-red-500"
                  )}
                />
                <label
                  className={clsx(
                    "absolute left-4 top-2 text-gray-400 text-sm transition-all duration-200",
                    form.address
                      ? "text-xs top-1 text-indigo-600"
                      : "peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm"
                  )}
                >
                  Address *
                </label>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Payment */}
              <div className="relative">
                <input
                  name="payment"
                  value={form.payment}
                  onChange={handleChange}
                  className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-2 outline-none focus:border-indigo-500"
                />
                <label className="absolute left-4 top-2 text-gray-500 text-sm">Expected Payment *</label>
                {errors.payment && <p className="text-red-500 text-xs">{errors.payment}</p>}
              </div>

              {/* Duration - Headless UI Listbox */}
              <div className="w-full">
                <Listbox
                  value={DURATION_OPTIONS.find((o) => o.value === form.durationType) || undefined}
                  onChange={(val: { value: string; label: string }) =>
                    setForm({ ...form, durationType: val.value })
                  }
                >
                  <div className="relative">
                    <Listbox.Button className="w-full flex items-center justify-between border rounded-xl px-4 py-3 text-left focus:outline-none border-gray-300 focus:border-indigo-500">
                      <span className={form.durationType ? "text-gray-900" : "text-gray-400"}>
                        {form.durationType
                          ? DURATION_OPTIONS.find((o) => o.value === form.durationType)?.label
                          : "Select Duration *"}
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                      {DURATION_OPTIONS.map((opt) => (
                        <Listbox.Option key={opt.value} value={opt}>
                          {({ selected, active }) => (
                            <div
                              className={`cursor-pointer select-none px-4 py-2 rounded-lg ${active ? "bg-indigo-50 text-indigo-700" : "text-gray-700"
                                }`}
                            >
                              {opt.label} {selected && "✔️"}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                {errors.durationType && <p className="text-red-500 text-xs mt-1">{errors.durationType}</p>}
              </div>
            </div>

            <button
              onClick={handleBasicSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {/* Step 2 - Skills / Contractor Subcategory */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
              Select Category
            </h2>

            {/* Worker & Contractor Category Selection */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => {
                  setSelectedCategory("Worker");
                  setSelectedSubCategory(null); // reset sub-category
                }}
                className={`p-6 rounded-2xl border-2 text-lg font-semibold transition ${selectedCategory === "Worker"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                  : "border-gray-300 hover:border-indigo-400"
                  }`}
              >
                👷 Worker
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("Contractor");
                  setSelectedSubCategory(null); // reset sub-category
                }}
                className={`p-6 rounded-2xl border-2 text-lg font-semibold transition ${selectedCategory === "Contractor"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                  : "border-gray-300 hover:border-indigo-400"
                  }`}
              >
                🏗️ Contractor
              </button>
            </div>

            {/* Worker Skills */}
            {selectedCategory === "Worker" && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                  Select Skills
                </h3>
                <CheckboxGroup
                  options={SKILL_OPTIONS}
                  value={selectedSkills}
                  onChange={setSelectedSkills}
                />
              </>
            )}

            {/* Contractor Subcategories */}
            {selectedCategory === "Contractor" && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                  Select Sub-Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {CONTRACTOR_SUBCATEGORIES.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`p-4 rounded-xl border-2 text-md font-medium transition ${selectedSubCategory === sub
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                        : "border-gray-300 hover:border-indigo-400"
                        }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={handleFinalSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold mt-6"
              disabled={selectedCategory === null}
            >
              Finish →
            </button>
          </motion.div>
        )}

        {/* Step 3 - ID Card */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <WorkerIdCard workerCode={workerCode || ""} />
            <button
              onClick={() => setStep(1)}
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
