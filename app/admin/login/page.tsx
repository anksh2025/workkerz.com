"use client"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

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
      setError(j.error || "Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xl font-bold shadow-md">
            W
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage Workkerz</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="mt-6 space-y-5">
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                required
                defaultValue="admin@workkerz.com"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm  focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm  focus:border-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Workkerz Admin
        </p>
      </div>
    </div>
  )
}
