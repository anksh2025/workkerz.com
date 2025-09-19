"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeOff, MessageCircle, HelpCircle, ChevronDown } from "lucide-react";
import { faqs } from "../../components/faqs";
import Image from "next/image";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState(faqs[0].category);
  const [openIndices, setOpenIndices] = useState<string[]>([]);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [speakingIndex, setSpeakingIndex] = useState<string | null>(null);

  const toggleOpen = (index: string) => {
    setOpenIndices(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
  };

  const speak = (index: string, faq: { q: string; a: string; a_hi?: string }) => {
    if (!window.speechSynthesis) return alert("❌ Your browser does not support speech.");
    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    const text = lang === "hi" && faq.a_hi ? `${faq.q}. ${faq.a_hi}` : `${faq.q}. ${faq.a}`;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (lang === "hi") {
      const preferredHindiVoices = ["Google हिन्दी", "Microsoft Hindi", "hi-IN"];
      utterance.voice = voices.find(v => preferredHindiVoices.includes(v.name)) || voices.find(v => v.lang.startsWith("hi")) || voices[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.15;
    } else {
      const preferredEnglishVoices = ["Samantha", "Google UK English Female"];
      utterance.voice = voices.find(v => preferredEnglishVoices.includes(v.name)) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
    }

    utterance.onend = () => setSpeakingIndex(null);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-72 md:w-80 lg:w-64 bg-white shadow-lg rounded-xl p-4 flex flex-col">
        {/* Language Selector - Top */}
        <div className="mb-6 relative w-full max-w-[180px] mx-auto bg-gray-100 rounded-full p-1 flex select-none shadow-inner positi">
          {/* Sliding indicator */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"
            style={{ transform: lang === "en" ? "translateX(0%)" : "translateX(100%)" }}
          />

          {/* English Button */}
          <button
            onClick={() => setLang("en")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold transition-colors duration-300 ${lang === "en" ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Image src="https://flagcdn.com/gb.svg" alt="EN" width={16} height={16} className="rounded-full" />
            EN
          </button>

          {/* Hindi Button */}
          <button
            onClick={() => setLang("hi")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold transition-colors duration-300 ${lang === "hi" ? "text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Image src="https://flagcdn.com/in.svg" alt="HI" width={16} height={16} className="rounded-full" />
            HI
          </button>
        </div>
        {/* Sidebar Header */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" /> Categories
        </h2>

        {/* Categories List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {faqs.map(cat => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${selectedCategory === cat.category
                ? `${cat.color} text-white shadow-md`
                : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                }`}
            >
              {cat.category}
              {selectedCategory === cat.category && (
                <span className="text-white text-sm font-semibold">✔</span>
              )}
            </button>
          ))}
        </div>
      </aside>



      {/* Main Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-6">
          <HelpCircle className="mx-auto w-16 h-16 text-indigo-600" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-2 text-base md:text-lg">
            Quick answers about <span className="font-semibold text-indigo-600">Workkerz.com</span>
          </p>
        </div>

        {/* FAQs */}
        {faqs
          .filter(cat => cat.category === selectedCategory)
          .map((cat, sectionIndex) =>
            cat.items.map((faq, i) => {
              const index = `${sectionIndex}-${i}`;
              const isOpen = openIndices.includes(index);
              const isSpeaking = speakingIndex === index;

              return (
                <motion.div
                  key={index}
                  layout
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
                >
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleOpen(index)}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        isSpeaking ? stopSpeaking() : speak(index, faq);
                      }}
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${isSpeaking ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                        } shadow transition mr-3 flex-shrink-0`}
                    >
                      {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeOff className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 flex justify-between items-center">
                      <h3 className="text-gray-900 font-medium">{faq.q}</h3>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 text-gray-700 text-sm overflow-y-auto mt-2"
                      >
                        {lang === "hi" && faq.a_hi ? faq.a_hi : faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
      </main>
    </div>
  );
}
