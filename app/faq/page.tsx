// app/faq/page.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "General Information",
    items: [
      {
        q: "What is Workkerz.com?",
        a: "Workkerz.com is a digital platform that helps you find and hire skilled daily wage workers like construction laborers, plumbers, drivers, electricians, and more — all from your smartphone.",
      },
      {
        q: "How is Workkerz.com different from other job or service apps?",
        a: "Unlike generic job boards, Workkerz.com specializes in short-term workers, provides real-time availability, supports easy booking, and offers location-based discovery.",
      },
      {
        q: "Is Workkerz.com available in all Indian cities?",
        a: "We’re expanding rapidly! Currently, we operate in major cities. Enter your pin code in the app to check availability in your area.",
      },
      {
        q: "Do you only offer construction workers?",
        a: "No. We also provide drivers, delivery helpers, electricians, cleaners, plumbers, housekeeping staff, loaders/packers, office boys, and more.",
      },
    ],
  },
  {
    category: "App & Account",
    items: [
      {
        q: "How do I create an account?",
        a: "Download the Workkerz.com app, enter your mobile number, and verify with OTP.",
      },
      {
        q: "Do I need to upload documents to use the app?",
        a: "No. Customers don’t need to submit documents. Only workers need to verify their ID and skills.",
      },
      {
        q: "Can I use the same account on multiple devices?",
        a: "Yes, but OTP verification will be required each time for security.",
      },
      {
        q: "How can I update my address or profile info?",
        a: "Go to Settings > Profile or Saved Addresses and edit your details easily.",
      },
    ],
  },
  // Add more categories (Booking, Payments, Safety, etc.) following same structure
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto w-12 h-12 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Answers to common questions about using{" "}
            <span className="font-semibold text-indigo-600">Workkerz.com</span>
          </p>
        </div>

        {/* FAQ List */}
        {faqs.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold px-6 py-4 border-b bg-gray-50 text-gray-800 rounded-t-2xl">
              🔹 {section.category}
            </h2>
            <div className="divide-y">
              {section.items.map((faq, i) => {
                const index = `${sectionIndex}-${i}`;
                const isOpen = openIndex === index;
                return (
                  <div key={i} className="px-6 py-4">
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : (index as any))
                      }
                      className="flex justify-between items-center w-full text-left"
                    >
                      <span className="font-medium text-gray-900">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-700">
            Still have questions? Reach us at{" "}
            <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=workkerz.com@gmail.com&su=Workkerz%20Inquiry&body=Hello%20Workkerz%20Team,"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                  >
                    workkerz.com@gmail.com
                  </a>{" "}
            or call{" "}
            <a
                  href="tel:07554522451"
                  className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                >
                  0755-4522451
                </a>
          </p>
        </div>
      </div>
    </div>
  );
}
