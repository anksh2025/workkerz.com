"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const fd = new FormData(e.currentTarget)
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      })

      if (res.ok) {
        window.location.href = "/admin/dashboard"
      } else {
        const j = await res.json()
        setError(j.error || "Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-2xl bg-gray-400 text-lg font-bold shadow-lg">
            <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Workkerz Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Secure access to Workkerz Admin</p>
        </div>


        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-300 bg-red-100/80 p-3 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Username / Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-gray-600 bg-black/40 text-white pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400/40"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-600 bg-black/40 text-white pl-10 pr-10 py-2 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-400/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-md transition flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Workkerz Admin. All rights reserved.
        </p>
      </div>
    </div>
  )
}
