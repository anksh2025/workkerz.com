"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaEnvelope, FaPhone, FaLocationDot } from "react-icons/fa6";
import { SiX } from "react-icons/si";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("contacts").insert([
      {
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        message: form.message, // ✅ Added this line
        categories: ["General Inquiry"], // default or dynamic
      },

    ]);

    if (error) {
      console.error(error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left */}
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl rounded-2xl p-8 border border-gray-200 flex flex-col justify-between"
        >
          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Let’s Connect
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Have questions or ideas? Reach us anytime — our team will be glad to help.
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FaEnvelope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=workkerz.com@gmail.com&su=Workkerz%20Inquiry&body=Hello%20Workkerz%20Team,"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                  >
                    workkerz.com@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FaPhone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a
                  href="tel:07554522451"
                  className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                >
                  0755-4522451
                </a>
              </div>
            </div>


            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FaLocationDot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <a
                  href="https://www.google.com/maps?q=Bhopal,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
                >
                  Bhopal, India
                </a>
              </div>

            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="https://www.facebook.com/share/14G7c8kqTvF/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href="https://www.instagram.com/workkerz?igsh=MTR2M3RlYXhoNzhjbQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 text-xs font-medium hover:bg-pink-100 transition"
            >
              <FaInstagram /> Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/workkerz-com-574614381"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href="https://x.com/workkerz?t=L_6frFIMxlSgXYTPjG_nuA&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium hover:bg-gray-200 transition"
            >
              <FaXTwitter />
            </a>
          </div>
        </motion.div>


        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-xl shadow-xl 
             rounded-2xl p-6 sm:p-8 md:p-12 space-y-8 border border-gray-100"
            >
              {/* Heading */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Get in Touch
                </h2>
                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                  We’d love to hear from you. Fill out the form below and our team will get back to you soon.
                </p>
              </div>

              {/* Inputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-xs font-medium text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-1 text-sm text-gray-900 shadow-sm 
                   focus:border-gray-400 focus:shadow-md outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-1 text-sm text-gray-900 shadow-sm 
                   focus:border-gray-400 focus:shadow-md outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-1 text-sm text-gray-900 shadow-sm 
                   focus:border-gray-400 focus:shadow-md outline-none transition-all duration-200"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label htmlFor="address" className="block text-xs font-medium text-gray-600">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-1 text-sm text-gray-900 shadow-sm 
                   focus:border-gray-400 focus:shadow-md outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-medium text-gray-600">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-1 text-sm text-gray-900 shadow-sm 
                   focus:border-gray-400 focus:shadow-md outline-none transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                 text-white py-3 rounded-xl text-sm sm:text-base font-medium shadow-md 
                 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg 
                 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send Message
                </button>
              </div>
            </form>




          ) : (
            <div className="text-center text-green-600">
              ✅ Message Sent! We’ll get back to you soon.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
