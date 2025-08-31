"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📞 Get in Touch</h1>
          <p className="text-gray-600 mb-8">
            Fill out the form and we’ll reach back to you.
          </p>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-indigo-600" />
              <span>workkerz.com@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-indigo-600" />
              <span>0755-4522451</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-indigo-600" />
              <span>Bhopal, India</span>
            </div>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-12 mt-10">
            <a
              href="https://www.facebook.com/share/14G7c8kqTvF/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-400 text-5xl"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/workkerz?igsh=MTR2M3RlYXhoNzhjbQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 text-5xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/workkerz-com-574614381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-500 text-5xl"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://x.com/workkerz?t=L_6frFIMxlSgXYTPjG_nuA&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 text-5xl"
            >
              <SiX />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
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
