"use client";
import { ShieldCheck, Search, CreditCard, Layers, Clock, GraduationCap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🚀 Welcome to <span className="text-yellow-300">Workkerz.com</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          India’s Digital Labor Marketplace – bringing workers and customers together with 
          trust, transparency, and convenience.
        </p>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Why Workkerz.com?
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Whether you are a customer looking for skilled workers or a worker searching 
          for regular jobs, Workkerz.com gives you everything you need to hire or work 
          with trust and ease.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto pb-20">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 text-center"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Closing Section */}
      <section className="bg-indigo-50 py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          More Than Just a Platform
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
          👉 Workkerz.com is more than just a platform — it’s a bridge of trust between 
          workers and customers, creating opportunities, dignity, and convenience across India.
        </p>
      </section>
    </div>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Workers & Customers",
    desc: "Safety and trust first – all profiles are verified for your peace of mind.",
  },
  {
    icon: Search,
    title: "Easy Job Booking",
    desc: "Quick search & instant hiring across multiple categories.",
  },
  {
    icon: CreditCard,
    title: "Transparent Payments",
    desc: "Fair pricing with no hidden cuts or surprises.",
  },
  {
    icon: Layers,
    title: "Multiple Categories",
    desc: "Construction, household, drivers, electricians, and many more.",
  },
  {
    icon: Clock,
    title: "On-Time Payouts",
    desc: "Workers get paid without delays, always on time.",
  },
  {
    icon: GraduationCap,
    title: "Support & Training",
    desc: "Helping workers grow their skills and income.",
  },
];
