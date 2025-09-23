"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import clsx from "clsx";
import { Toaster, toast } from "sonner";

function generateWorkerCode() {
  return "Wrk" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function Field({ label, children, required = false, error }: any) {
  return (
    <label className="block space-y-1">
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {required && <span className="text-red-500 text-sm font-bold">*</span>}
      </div>
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </label>
  );
}

const SKILL_OPTIONS = [
  { label: "Plumber / प्लम्बर", value: "plumber", icon: "🔧", rate: "₹200-500/hr" },
  { label: "Electrician / इलेक्ट्रीशियन", value: "electrician", icon: "⚡", rate: "₹250-600/hr" },
  { label: "Carpenter / बढ़ई", value: "carpenter", icon: "🔨", rate: "₹300-700/hr" },
  { label: "Painter / पेंटर", value: "painter", icon: "🎨", rate: "₹200-450/hr" },
  { label: "Cleaner / सफाईकर्मी", value: "cleaner", icon: "🧹", rate: "₹150-300/hr" },
  { label: "Cook / रसोइया", value: "cook", icon: "🍳", rate: "₹200-400/hr" },
  { label: "Driver / चालक", value: "driver", icon: "🚗", rate: "₹300-800/hr" },
  { label: "Gardener / माली", value: "gardener", icon: "🌱", rate: "₹200-400/hr" },
  { label: "AC Technician / ए.सी. तकनीशियन", value: "ac_technician", icon: "❄️", rate: "₹300-600/hr" },
  { label: "Appliance Repair / उपकरण मरम्मत", value: "appliance_repair", icon: "🛠️", rate: "₹250-500/hr" },
];

function CheckboxGroup({ options, value, onChange }: any) {
  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((x: string) => x !== val) : [...value, val]);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((o: any) => (
        <button
          key={o.value}
          type="button"
          onClick={() => toggle(o.value)}
          className={clsx(
            "flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-md transition-all duration-300 backdrop-blur-md",
            value.includes(o.value)
              ? "border-indigo-600 bg-indigo-100 scale-105 shadow-lg"
              : "border-gray-200 hover:border-indigo-300 hover:shadow"
          )}
        >
          <span className="text-4xl mb-2">{o.icon}</span>
          <span className="font-semibold">{o.label}</span>
          <span className="text-sm text-gray-500">{o.rate}</span>
        </button>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [workerCode, setWorkerCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    phone: "", full_name: "", email: "", address: "", payment: "", durationType: ""
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBasicSubmit = () => {
    const newErrors: any = {};
    if (!form.full_name) newErrors.full_name = "Required / आवश्यक";
    if (!form.phone) newErrors.phone = "Required / आवश्यक";
    else if (form.phone.length !== 10) newErrors.phone = "10 digits / 10 अंक";
    if (!form.address) newErrors.address = "Required / आवश्यक";
    if (!form.payment) newErrors.payment = "Required / आवश्यक";
    if (!form.durationType) newErrors.durationType = "Required / आवश्यक";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error("Please fix errors / कृपया सभी त्रुटियाँ ठीक करें");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
  if (selectedSkills.length === 0) {
    toast.error("Please select at least one skill / कम से कम एक कौशल चुनें!");
    return;
  }

  // 🔍 Step 1 — check if already exists
  const { data: existing, error: fetchError } = await supabase
    .from("workers")
    .select("id")
    .or(`phone.eq.${form.phone},email.eq.${form.email}`);

  if (fetchError) {
    console.error(fetchError);
    toast.error("Check failed: " + fetchError.message);
    return;
  }

  if (existing && existing.length > 0) {
    toast.error("Worker already exists / वर्कर पहले से मौजूद है");
    return;
  }

  // ✅ Step 2 — insert new worker
  const code = generateWorkerCode();
  const { error: insertError } = await supabase.from("workers").insert([{
    phone: form.phone,
    full_name: form.full_name,
    email: form.email,
    address: form.address,
    expected_payment: form.payment,
    duration_type: form.durationType,
    worker_code: code,
    categories: selectedSkills,
  }]);

  if (insertError) {
    console.error(insertError);
    toast.error("Submit failed: " + insertError.message);
    return;
  }

  setWorkerCode(code);
  setStep(3);
  toast.success("Worker onboarded successfully! / वर्कर रजिस्टर हो गया");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <Toaster position="top-right" richColors expand />
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10">

        {step === 1 && (
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-center text-indigo-700">👷 Worker Onboarding / वर्कर पंजीकरण</h1>

            <Field label="Full Name / पूरा नाम" required error={errors.full_name}>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className={clsx("w-full border rounded-xl px-4 py-3 mt-1 focus:ring",
                  errors.full_name && "border-red-500")}
              />
            </Field>

            <Field label="Mobile Number / मोबाइल नंबर" required error={errors.phone}>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setForm({ ...form, phone: val });
                }}
                className={clsx("w-full border rounded-xl px-4 py-3 mt-1 focus:ring",
                  errors.phone && "border-red-500")}
              />
            </Field>

            <Field label="Email / ईमेल">
              <input name="email" value={form.email} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1" />
            </Field>

            <Field label="Address / पता" required error={errors.address}>
              <input name="address" value={form.address} onChange={handleChange}
                className={clsx("w-full border rounded-xl px-4 py-3 mt-1",
                  errors.address && "border-red-500")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Payment / भुगतान" required error={errors.payment}>
                <input name="payment" value={form.payment} onChange={handleChange}
                  className={clsx("w-full border rounded-xl px-4 py-3 mt-1",
                    errors.payment && "border-red-500")} />
              </Field>
              <Field label="Type / प्रकार" required error={errors.durationType}>
                <select name="durationType" value={form.durationType} onChange={handleChange}
                  className={clsx("w-full border rounded-xl px-4 py-3 mt-1",
                    errors.durationType && "border-red-500")}>
                  <option value="">Select / चुनें</option>
                  <option value="hour">Per Hour / प्रति घंटा</option>
                  <option value="day">Per Day / प्रति दिन</option>
                </select>
              </Field>
            </div>

            <button onClick={handleBasicSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Select Your Skills / अपने कौशल चुनें</h2>
            <CheckboxGroup options={SKILL_OPTIONS} value={selectedSkills} onChange={setSelectedSkills} />
            <button onClick={handleFinalSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl mt-6">
              Finish →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Registration Complete / पंजीकरण पूरा हुआ</h1>
            <p className="text-lg font-semibold text-indigo-700 mb-6">
              Your Worker ID / आपका वर्कर आईडी: {workerCode}
            </p>
            <button onClick={() => { setForm({ phone: "", full_name: "", email: "", address: "", payment: "", durationType: "" }); setSelectedSkills([]); setWorkerCode(null); setStep(1); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl">
              Back to Home / होम पर वापस जाएं
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
