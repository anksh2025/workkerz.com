"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend or Supabase to send messages
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8 flex flex-col justify-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📞 Get in Touch</h1>
          <p className="text-gray-600 mb-8">
            Have questions, suggestions, or need help? We’d love to hear from you. 
            Fill out the form or reach us directly using the details below.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-700">support@yourcompany.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-700">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-700">Delhi, India</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          {!submitted ? (
            <>
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">✅ Message Sent!</h2>
              <p className="text-gray-600">We’ll get back to you as soon as possible.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
