"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Calendar, Briefcase } from "lucide-react";

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  joined_at: string;
};

export default function UserProfilePage() {
  // Fake sample data
  const [user] = useState<UserProfile>({
    id: "u1",
    full_name: "Ramesh Kumar",
    email: "ramesh@example.com",
    phone: "9876543210",
    address: "Delhi, India",
    categories: ["Plumber", "Cook", "Electrician"],
    joined_at: "2024-02-15T10:00:00Z",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
            {user.full_name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.full_name}</h1>
            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
              <Briefcase className="w-4 h-4" />
              {user.categories.join(", ")}
            </p>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.joined_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
            <Phone className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-semibold">{user.phone}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
            <Mail className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-semibold">{user.address}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {user.categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-full shadow-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Activity / Stats */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-indigo-50">
              <p className="text-2xl font-bold text-indigo-600">120</p>
              <p className="text-gray-500 text-sm">Jobs Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-gray-500 text-sm">Success Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50">
              <p className="text-2xl font-bold text-yellow-600">4.7</p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50">
              <p className="text-2xl font-bold text-purple-600">15</p>
              <p className="text-gray-500 text-sm">Ongoing Jobs</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
