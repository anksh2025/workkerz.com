"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { clsx } from "clsx";

// ---- UI Helpers ----
export function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function Radio({
  name,
  options,
  required = false,
}: {
  name: string;
  options: { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={clsx(
            "flex items-center gap-3 rounded-xl border p-3 hover:bg-gray-50",
            "cursor-pointer"
          )}
        >
          <input
            className="h-4 w-4"
            type="radio"
            name={name}
            value={o.value}
            required={required}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup({
  name,
  options,
}: {
  name: string;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className="flex items-center gap-3 rounded-xl border p-3 hover:bg-gray-50 cursor-pointer"
        >
          <input className="h-4 w-4" type="checkbox" name={name} value={o.value} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

// ---- Onboarding Flow ----
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [workerId, setWorkerId] = useState<number | null>(null);
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

  // STEP 1: Always create new worker row
  const handleBasicSubmit = async () => {
    if (!form.phone || !form.full_name || !form.address) {
      alert("Phone, Name & Address are required!");
      return;
    }

    const { data, error } = await supabase
      .from("workers")
      .insert([
        {
          phone: form.phone,
          full_name: form.full_name,
          email: form.email,
          address: form.address,
        },
      ])
      .select("id, worker_code")
      .single();

    if (error) {
      console.error(error);
      alert("Error saving data");
    } else {
      const newId = data.id;
      setWorkerId(newId);

      let finalCode = data.worker_code;
      if (!finalCode) {
        finalCode = `wrkrz${newId}`;
        await supabase.from("workers").update({ worker_code: finalCode }).eq("id", newId);
      }
      setWorkerCode(finalCode);

      setStep(2);
    }
  };

  // STEP 2: Save selected skills
  const handleSkillsSubmit = async () => {
    if (!workerId) return;

    const { error } = await supabase
      .from("workers")
      .update({ categories: selectedSkills })
      .eq("id", workerId);

    if (error) {
      console.error(error);
      alert("Error saving skills");
    } else {
      setStep(3);
    }
  };

  return (
    <div>
      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold text-center mb-6">👷 Let’s get started!</h1>

            <div className="space-y-4">
              <Field label="Mobile Number" required>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </Field>

              <Field label="Full Name" required>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </Field>

              <Field label="Address" required>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </Field>

              <button
                onClick={handleBasicSubmit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 mt-4"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skill Selection */}
      {step === 2 && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Select Your Skills</h2>

            <CheckboxGroup
              name="skills"
              options={[
                { label: "Plumbing", value: "plumbing" },
                { label: "Electrician", value: "electrician" },
                { label: "Carpentry", value: "carpentry" },
                { label: "Painting", value: "painting" },
              ]}
            />

            <button
              onClick={() => {
                const checked = Array.from(
                  document.querySelectorAll<HTMLInputElement>('input[name="skills"]:checked')
                ).map((el) => el.value);
                setSelectedSkills(checked);
                handleSkillsSubmit();
              }}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 mt-4"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow text-center">
            <h1 className="text-2xl font-bold text-green-700 mb-4">
              🎉 Onboarding Complete!
            </h1>
            {workerCode && (
              <p className="text-lg font-semibold text-indigo-700 mb-6">
                Your Worker ID: {workerCode}
              </p>
            )}
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
