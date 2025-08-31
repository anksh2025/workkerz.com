"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import clsx from "clsx";
import { Toaster, toast } from "sonner";

// ---------- Worker Code Generator ----------
function generateWorkerCode(): string {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return "Wrk" + randomStr.toUpperCase(); // Example: Wrk94A49C6C
}

// ---------- UI Helpers ----------
function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {required && (
          <span
            className="text-red-500 text-sm font-bold"
            title="This field is required"
          >
            *
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

// ---------- Skill Options ----------
const SKILL_OPTIONS = [
  { label: "Plumber", value: "plumber", icon: "🔧", rate: "₹200-500/hr" },
  { label: "Electrician", value: "electrician", icon: "⚡", rate: "₹250-600/hr" },
  { label: "Carpenter", value: "carpenter", icon: "🔨", rate: "₹300-700/hr" },
  { label: "Painter", value: "painter", icon: "🎨", rate: "₹200-450/hr" },
  { label: "Cleaner", value: "cleaner", icon: "🧹", rate: "₹150-300/hr" },
  { label: "Cook", value: "cook", icon: "🍳", rate: "₹200-400/hr" },
  { label: "Driver", value: "driver", icon: "🚗", rate: "₹300-800/hr" },
  { label: "Gardener", value: "gardener", icon: "🌱", rate: "₹200-400/hr" },
  { label: "AC Technician", value: "ac_technician", icon: "❄️", rate: "₹300-600/hr" },
  { label: "Appliance Repair", value: "appliance_repair", icon: "🛠️", rate: "₹250-500/hr" },
];

// ---------- CheckboxGroup (Card style) ----------
function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; icon: string; rate: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((x) => x !== val) : [...value, val]
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => toggle(o.value)}
          className={clsx(
            "flex flex-col items-center justify-center rounded-xl border p-6 text-center shadow-sm transition-all duration-200",
            value.includes(o.value)
              ? "border-indigo-600 bg-indigo-50 scale-105"
              : "border-gray-200 hover:border-indigo-300"
          )}
        >
          <span className="text-3xl mb-2">{o.icon}</span>
          <span className="font-medium">{o.label}</span>
          <span className="text-sm text-gray-500">{o.rate}</span>
          <input
            type="checkbox"
            readOnly
            checked={value.includes(o.value)}
            className="hidden"
          />
        </button>
      ))}
    </div>
  );
}

// ---------- Onboarding Page ----------
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [workerCode, setWorkerCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    phone: "",
    full_name: "",
    email: "",
    address: "",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Basic info validation
  const handleBasicSubmit = () => {
    if (!form.phone || !form.full_name || !form.address) {
      toast.error("Phone, Name & Address are required!");
      return;
    }
    if (form.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    setStep(2);
  };

  // STEP 2: Skills + Final Save
  const handleFinalSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast.error("Please select at least one skill!");
      return;
    }

    const code = generateWorkerCode();

    const { error } = await supabase.from("workers").insert([
      {
        phone: form.phone,
        full_name: form.full_name,
        email: form.email,
        address: form.address,
        worker_code: code,
        categories: selectedSkills,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error(error.message);
    } else {
      setWorkerCode(code);
      setStep(3);
      toast.success("Worker onboarded successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
      {/* ✅ Toaster for global notifications */}
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "15px",
            fontWeight: 500,
          },
        }}
      />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                  step >= s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={clsx(
                    "flex-1 h-1 mx-2 rounded",
                    step > s ? "bg-indigo-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">
              👷 Worker Onboarding
            </h1>
            <div className="space-y-4">
              <Field label="Full Name" required>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoComplete="name"
                  required
                />
              </Field>

              <Field label="Mobile Number" required>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) {
                      setForm({ ...form, phone: val });
                    }
                  }}
                  placeholder="10-digit mobile number"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>

              <Field label="Address" required>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoComplete="street-address"
                  required
                />
              </Field>

              <button
                onClick={handleBasicSubmit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition mt-4"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-6 text-center">
              Select Your Skills
            </h2>
            <CheckboxGroup
              options={SKILL_OPTIONS}
              value={selectedSkills}
              onChange={setSelectedSkills}
            />
            <button
              onClick={handleFinalSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition mt-6"
            >
              Finish →
            </button>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              🎉 Onboarding Complete!
            </h1>
            {workerCode && (
              <p className="text-lg font-semibold text-indigo-700 mb-6">
                Your Worker ID: {workerCode}
              </p>
            )}
            <button
              onClick={() => {
                setForm({ phone: "", full_name: "", email: "", address: "" });
                setSelectedSkills([]);
                setWorkerCode(null);
                setStep(1);
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
