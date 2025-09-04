"use client";

import { useState } from "react";
import { Shield, PlusCircle, X } from "lucide-react";
import PostBlogForm from "../../../components/PostBlogForm";
import AdminSidebarBlogManager from "../../../components/AdminSidebarBlogManager";

// Admin Login Modal
function AdminLogin({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Admin2025@") {
      onSuccess();
      onClose();
    } else {
      setError("❌ Incorrect password");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-red-500" /> Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// Main Blog Panel
export default function BlogMain() {
  const [view, setView] = useState<"post" | "admin">("post");
  const [showLogin, setShowLogin] = useState(false);

  const handleAdminClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-4 md:p-6 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 text-center md:text-left">
          📚 Blog Panel
        </h1>
        <nav className="flex flex-row md:flex-col gap-2 md:gap-3 justify-center md:justify-start">
          <button
            onClick={() => setView("post")}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg transition w-full md:w-auto justify-center md:justify-start ${
              view === "post"
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <PlusCircle className="w-5 h-5" /> Post New Blog
          </button>
          <button
            onClick={handleAdminClick}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg transition w-full md:w-auto justify-center md:justify-start ${
              view === "admin"
                ? "bg-gray-800 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Shield className="w-5 h-5" /> Admin Manager
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {view === "post" && (
          <div className="min-h-[calc(100vh-2rem)] max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 backdrop-blur shadow-2xl rounded-2xl p-6 md:p-10 space-y-6 md:space-y-8 border border-indigo-100">
            <PostBlogForm />
          </div>
        )}

        {view === "admin" && (
          <div className="max-w-full md:max-w-6xl mx-auto bg-gray-600 p-4 md:p-8 rounded-2xl shadow overflow-x-auto">
            <AdminSidebarBlogManager />
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLogin && <AdminLogin onSuccess={() => setView("admin")} onClose={() => setShowLogin(false)} />}
    </div>
  );
}
