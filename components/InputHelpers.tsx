// components/InputHelpers.tsx
import React from "react";

export type InputFieldProps = {
  label: string;
  helperText?: string;
  children: React.ReactNode;
};

export function InputField({ label, helperText, children }: InputFieldProps) {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      {children}
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}

export type RadioOption = { label: string; value: string };
export type RadioGroupProps = {
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: RadioOption[];
};

export function RadioGroup({ name, value, onChange, options }: RadioGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => {
        const checked = value === o.value;
        return (
          <label
            key={o.value}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none border flex items-center justify-center
              ${checked
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="hidden"
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

export type CheckboxGroupProps = {
  options: string[];
  values: string[];
  onChange: (val: string) => void;
};

export function CheckboxGroup({ options, values, onChange }: CheckboxGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => {
        const checked = values.includes(o);
        return (
          <label
            key={o}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none border flex items-center justify-center
              ${checked
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
          >
            <input
              type="checkbox"
              value={o}
              checked={checked}
              onChange={() => onChange(o)}
              className="hidden"
            />
            {o}
          </label>
        );
      })}
    </div>
  );
}
