// use client
"use client";

import React from "react";
import { motion } from "framer-motion";

type Lang = "hi" | "en";

interface StepTrackerProps {
    step: number;
    stepTitles: string[];
    onStepClick?: (i: number) => void;
    lang?: Lang;
    className?: string;
}

export default function StepTracker({
    step,
    stepTitles,
    onStepClick = () => { },
    lang = "en",
    className = "",
}: StepTrackerProps) {
    const total = stepTitles.length;

    const colors = [
        "from-pink-500 to-rose-500",
        "from-orange-500 to-amber-500",
        "from-green-500 to-emerald-500",
        "from-sky-500 to-blue-500",
        "from-purple-500 to-indigo-500",
    ];

    return (
        <div className={`w-full ${className}`}>
            {/* MOBILE: horizontal card stepper */}
            <div className="md:hidden bg-white rounded-xl shadow-sm p-4">
                <div className="relative flex justify-between items-start">
                    {/* background line */}
                    <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200" />
                    {/* animated progress */}
                    <motion.div
                        className="absolute top-6 left-8 h-0.5 rounded"
                        initial={false}
                        animate={{
                            width: `${(step / Math.max(1, total - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                            background: `linear-gradient(90deg, ${getColorStops(step, colors)})`,
                        }}
                    />

                    {stepTitles.map((title, i) => {
                        const isActive = i === step;
                        const isDone = i < step;
                        const color = colors[i % colors.length];

                        return (
                            <button
                                key={i}
                                onClick={() => onStepClick(i)}
                                className="flex-1 flex flex-col items-center px-2"
                            >
                                {/* Circle with number/check */}
                                <span
                                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-md z-10
                  ${isDone ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white" :
                                            isActive ? `bg-gradient-to-br ${color} text-white ring-2 ring-sky-200` :
                                                "bg-gray-100 text-gray-500"}
                  `}
                                >
                                    {isDone ? "✓" : i + 1}
                                </span>

                                {/* Title inside a mini card */}
                                <div
                                    className={`mt-2 px-2 py-1 rounded-lg text-[11px] font-medium border w-20 text-center truncate
                  ${isActive ? "bg-sky-50 border-sky-300 text-sky-700" :
                                            isDone ? "bg-emerald-50 border-emerald-300 text-emerald-700" :
                                                "bg-gray-50 border-gray-200 text-gray-500"}
                  `}
                                >
                                    {title}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* DESKTOP: vertical card sidebar */}
            <div className="hidden md:flex md:flex-col md:w-72 bg-white rounded-2xl border shadow p-6 items-center">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-6 tracking-wide text-center">
                    {lang === "hi" ? "सर्वेक्षण प्रगति" : "Survey Progress"}
                </h3>

                <div className="hidden md:flex md:flex-col md:w-72 bg-white rounded-2xl border shadow p-6">
  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-6 tracking-wide">
    {lang === "hi" ? "सर्वेक्षण प्रगति" : "Survey Progress"}
  </h3>

  <div className="relative w-full">
    {/* background vertical line */}
    <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gray-200" />

    {/* progress line */}
    <motion.div
      className="absolute left-[21px] top-0 w-0.5 rounded"
      initial={false}
      animate={{ height: `${((step + 1) / total) * 100}%` }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: `linear-gradient(180deg, ${getColorStops(step, colors)})`,
      }}
    />

    {/* Steps */}
    <ol className="relative flex flex-col gap-8 ml-0">
      {stepTitles.map((title, i) => {
        const isActive = i === step;
        const isDone = i < step;
        const color = colors[i % colors.length];

        return (
          <li
            key={i}
            onClick={() => onStepClick(i)}
            className="relative cursor-pointer flex items-center gap-3"
          >
            {/* Number / check circle */}
            <span
              className={`flex items-center justify-center rounded-full text-sm font-bold shadow-md transition-all duration-300
                ${isDone
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                  : isActive
                  ? `bg-gradient-to-br ${color} text-white ring-2 ring-sky-200 scale-110`
                  : "bg-gray-100 text-gray-500 ring-2 ring-gray-200"}`}
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                minHeight: "42px",
              }}
            >
              {isDone ? "✓" : i + 1}
            </span>

            {/* Step title box */}
            <div
              className={`px-3 py-2 rounded-lg border flex flex-col
                ${isActive ? "bg-sky-50 border-sky-300" :
                    isDone ? "bg-emerald-50 border-emerald-300" :
                      "bg-gray-50 border-gray-200"}`}
              style={{
                width: "180px",   // uniform width
                minHeight: "56px" // consistent height
              }}
            >
              <p
                className={`text-sm font-semibold truncate ${
                  isActive
                    ? "text-sky-700"
                    : isDone
                    ? "text-emerald-700"
                    : "text-gray-700"
                }`}
              >
                {title}
              </p>
              <p className="text-xs text-gray-400">
                {lang === "hi" ? "चरण" : "Step"} {i + 1}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
</div>

            </div>

        </div>
    );
}

/* Helper */
function getColorStops(step: number, colors: string[]) {
    const map: Record<string, string[]> = {
        "from-pink-500 to-rose-500": ["#ec4899", "#f43f5e"],
        "from-orange-500 to-amber-500": ["#f97316", "#f59e0b"],
        "from-green-500 to-emerald-500": ["#22c55e", "#10b981"],
        "from-sky-500 to-blue-500": ["#0ea5e9", "#3b82f6"],
        "from-purple-500 to-indigo-500": ["#8b5cf6", "#6366f1"],
    };
    const idx = Math.max(0, Math.min(step, colors.length - 1));
    const colorKey = colors[idx % colors.length];
    const pair = map[colorKey] || ["#06b6d4", "#3b82f6"];
    return `${pair[0]} 0%, ${pair[1]} 100%`;
}
