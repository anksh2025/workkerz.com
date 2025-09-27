"use client";

import React, { useRef, useState, useEffect } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [progressWidth, setProgressWidth] = useState(0);

    const colors = [
        "from-pink-500 to-rose-500",
        "from-orange-500 to-amber-500",
        "from-green-500 to-emerald-500",
        "from-sky-500 to-blue-500",
        "from-purple-500 to-indigo-500",
    ];

    // Measure step buttons and set progress width
    useEffect(() => {
        if (!containerRef.current) return;
        const buttons = Array.from(
            containerRef.current.querySelectorAll<HTMLButtonElement>("button")
        );
        if (!buttons.length) return;

        const first = buttons[0].getBoundingClientRect();
        const last = buttons[buttons.length - 1].getBoundingClientRect();
        const current = buttons[step].getBoundingClientRect();

        const distance =
            current.left + current.width / 2 - (first.left + first.width / 2);

        setProgressWidth(distance);
    }, [step, stepTitles]);

    return (
        <div className={`w-full ${className}`}>
            {/* MOBILE: horizontal stepper */}
            <div className="md:hidden relative">
                <div
                    ref={containerRef}
                    className="relative overflow-x-auto flex gap-6 snap-x snap-mandatory hide-scrollbar px-4"
                >
                    {/* Background line */}
                    <div className="absolute top-4 left-0 h-0.5 bg-gray-200 z-0 rounded-full"
                        style={{ width: "500px" }} // <-- control width here"
                    />

                    {/* Progress line */}
                    <motion.div
                        className="absolute top-4 h-0.5 rounded-full z-10"
                        initial={false}
                        animate={{ width: `${((step + 1) / total) * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                            background: `linear-gradient(180deg, ${getColorStops(step, colors)})`,
                            left: 0,
                            width: "500px"
                        }}
                    />

                    {/* Step buttons */}
                    {stepTitles.map((title, i) => {
                        const isActive = i === step;
                        const isDone = i < step;
                        const color = colors[i % colors.length];

                        return (
                            <button
                                key={i}
                                onClick={() => onStepClick(i)}
                                className="flex flex-col items-center w-20 flex-shrink-0 snap-center z-20"
                            >
                                {/* Circle tracker */}
                                <span
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-base font-bold shadow-md transition-all duration-300
                  ${isDone
                                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                                            : isActive
                                                ? `bg-gradient-to-br ${color} text-white ring-2 ring-sky-200`
                                                : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {isDone ? "✓" : i + 1}
                                </span>

                                {/* Step name in a box */}
                                <div
                                    className={`mt-2 px-2 py-1 rounded-lg text-xs font-medium text-center truncate transition
                  ${isActive
                                            ? "bg-sky-50 border border-sky-300 text-sky-700 shadow-sm"
                                            : isDone
                                                ? "bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-sm"
                                                : "bg-gray-50 border border-gray-200 text-gray-400"
                                        }`}
                                    style={{ minWidth: "60px", maxWidth: "80px" }}
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
                ${isActive
                                                ? "bg-sky-50 border-sky-300"
                                                : isDone
                                                    ? "bg-emerald-50 border-emerald-300"
                                                    : "bg-gray-50 border-gray-200"}`}
                                        style={{
                                            width: "180px", // uniform width
                                            minHeight: "56px", // consistent height
                                        }}
                                    >
                                        <p
                                            className={`text-sm font-semibold truncate ${isActive
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
