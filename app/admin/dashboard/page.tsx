"use client";

import { useEffect, useState } from "react";
import { SKILL_OPTIONS } from "../../../lib/skills";
import { supabase } from "../../../lib/supabaseClient";
import { ReactNode } from "react";

import {
  Users,
  ClipboardList,
  GraduationCap,
  Bell,
  Search,
  Home,
  User,
  Table,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


// 🛠 For export
import * as XLSX from "xlsx";

interface Survey {
  id: number;
  created_at: string;
  full_name?: string | null;
  phone?: string | null;
  q3?: string | null;
  q4?: string | null;
  q5?: string | null;
  q6?: string[] | null;
  q7?: string[] | null;
  q8?: string | null;
  q9?: string | null;
  q10?: string | null;
  q11?: string | null;
}

interface Worker {
  categories: string[];
  worker_code: ReactNode;
  id: string; // custom WrkXXXX format
  created_at: string;
  full_name: string;
  phone: string;
  email?: string | null;
  address?: string | null;   // 👈 add this
  category?: string | null;
  status?: string | null;
}

export default function Dashboard() {
  const [rows, setRows] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  async function fetchData(filters = false) {
    let query = supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters) {
      if (name) query = query.ilike("full_name", `%${name}%`);
      if (phone) query = query.ilike("phone", `%${phone}%`);
      if (fromDate) query = query.gte("created_at", fromDate);
      if (toDate) query = query.lte("created_at", toDate + "T23:59:59");
    }

    const { data, error } = await query;
    if (!error && data) setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("surveys_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "surveys" },
        () => fetchData(true)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 📊 Stats
  const stats = {
    total: rows.length,
    daily: rows.filter((r) => r.q4 === "daily").length,
    needTraining: rows.filter((r) => r.q10 === "need-training").length,
  };

  const lineData = [
    { name: "Mon", value: 20 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 32 },
    { name: "Thu", value: 60 },
    { name: "Fri", value: 80 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 70 },
  ];
  const barData = [
    { name: "Daily", users: stats.daily },
    { name: "Need Training", users: stats.needTraining },
    { name: "Total", users: stats.total },
  ];

  // 📤 Export Functions
  const exportCSV = () => {
    const csv = [
      [
        "Date",
        "Name",
        "Phone",
        "Find Work?",
        "Work Frequency",
        "Satisfied?",
        "Problems",
        "Needs",
        "Payment",
        "Smartphone",
        "Apps Comfortable",
        "Pay Fee",
      ],
      ...rows.map((r) => [
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
        r.full_name ?? "—",
        r.phone ?? "—",
        r.q3 ?? "—",
        r.q4 ?? "—",
        r.q5 ?? "—",
        Array.isArray(r.q6) ? r.q6.join(", ") : r.q6 ?? "—",
        Array.isArray(r.q7) ? r.q7.join(", ") : r.q7 ?? "—",
        r.q8 ?? "—",
        r.q9 ?? "—",
        r.q10 ?? "—",
        r.q11 ?? "—",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "survey_data.csv";
    link.click();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");
    XLSX.writeFile(workbook, "survey_data.xlsx");
  };

  // 👇 add this useEffect below fetchWorkers function
  async function fetchWorkers() {
    setWorkersLoading(true);
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching workers:", error);
    } else {
      setWorkers(data || []);
    }
    setWorkersLoading(false);
  }


  useEffect(() => {
    fetchWorkers();

    const channel = supabase
      .channel("workers_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workers" },
        () => fetchWorkers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="px-6 py-4 font-bold text-xl text-indigo-600">
          Creative Admin
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { label: "Dashboard", icon: <Home size={18} /> },
            { label: "User Profile", icon: <User size={18} /> },
            { label: "Survey List", icon: <Table size={18} /> },
            { label: "Workers", icon: <Users size={18} /> },
          ].map((item, i) => (
            <a
              key={i}
              onClick={() => setActivePage(item.label)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${activePage === item.label
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-indigo-50"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Dashboard Body */}
        <main className="p-6 space-y-6 overflow-y-auto">
          {/* ✅ Dashboard Page */}
          {activePage === "Dashboard" && (
            <div className="space-y-10">
              {/* 🔹 PART 1: Survey Section */}
              <section className="space-y-6">
                {/* Survey Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Total Surveys",
                      value: stats.total,
                      icon: <ClipboardList className="h-6 w-6" />,
                      color: "bg-gradient-to-r from-indigo-500 to-purple-600",
                    },
                    {
                      title: "Daily Workers",
                      value: stats.daily,
                      icon: <Users className="h-6 w-6" />,
                      color: "bg-gradient-to-r from-green-500 to-emerald-600",
                    },
                    {
                      title: "Need Training",
                      value: stats.needTraining,
                      icon: <GraduationCap className="h-6 w-6" />,
                      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`${s.color} rounded-xl p-5 flex items-center gap-4 text-white shadow-lg`}
                    >
                      <div className="bg-white/20 p-3 rounded-full">{s.icon}</div>
                      <div>
                        <p className="text-sm opacity-80">{s.title}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Survey Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Modern Line/Area Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-6">📈 Daily Activity</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={lineData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gradient Bar Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-6">📊 Survey Stats</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData} barSize={40}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#fb923c" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Bar dataKey="users" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </section>

              {/* 🔹 PART 2: Onboard Workers Section */}
              <section className="space-y-6">
                {/* Worker Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                    <p className="text-sm opacity-80">Total Workers</p>
                    <p className="text-2xl font-bold">{workers.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                    <p className="text-sm opacity-80">Unique Categories</p>
                    <p className="text-2xl font-bold">
                      {new Set(workers.flatMap((w) => w.categories || [])).size}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 text-white shadow-lg">
                    <p className="text-sm opacity-80">Latest Onboard</p>
                    <p className="text-lg font-semibold">
                      {workers[0]?.full_name || "—"}
                    </p>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Category Distribution</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(
                      workers.reduce((acc: Record<string, number>, w) => {
                        (w.categories || []).forEach((cat) => {
                          acc[cat] = (acc[cat] || 0) + 1;
                        });
                        return acc;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1]) // Highest count first
                      .map(([category, count]) => {
                        const option = SKILL_OPTIONS.find((o) => o.value === category);
                        return (
                          <div
                            key={category}
                            className="flex flex-col items-center justify-center rounded-2xl p-6 shadow-md bg-gradient-to-br from-indigo-50 to-white border hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                              <span className="text-2xl">{option?.icon ?? "🔹"}</span>
                            </div>
                            <span className="font-semibold text-gray-700 text-lg">
                              {option?.label ?? category}
                            </span>
                            <span className="text-indigo-600 font-extrabold text-2xl mt-1">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ✅ Table List Page */}
          {activePage === "Survey List" && (
            <>
              <header className="bg-white/80 backdrop-blur shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-20">
                {/* Left: Toggle Filter */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-400 transition"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Search size={18} className="text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {showFilters ? "Hide Filters" : "Search / Filter"}
                  </span>
                </div>
              </header>

              {showFilters && (
                <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      🔍 Search Filters
                    </h2>
                    <button
                      onClick={() => {
                        setName("");
                        setPhone("");
                        setFromDate("");
                        setToDate("");
                      }}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Search by Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        type="text"
                        placeholder="Search by Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">From Date</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">To Date</label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => fetchData(true)}
                      className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => fetchData(false)}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-200 transition"
                    >
                      Reset
                    </button>
                  </div>
                </section>
              )}

              <section className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Submissions</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={exportCSV}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      <Download size={16} /> CSV
                    </button>
                    <button
                      onClick={exportExcel}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Download size={16} /> Excel
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-gray-200">
                  <table className="min-w-[1400px] text-sm">
                    <thead className="bg-indigo-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                        <th className="px-4 py-2 text-left">How do you currently find work?</th>
                        <th className="px-4 py-2 text-left">How often do you get work?</th>
                        <th className="px-4 py-2 text-left">Are you comfortable using apps for finding work?</th>
                        <th className="px-4 py-2 text-left">Problems faced</th>
                        <th className="px-4 py-2 text-left">What do you want?</th>
                        <th className="px-4 py-2 text-left">Preferred payment</th>
                        <th className="px-4 py-2 text-left">Smartphone?</th>
                        <th className="px-4 py-2 text-left">Apps Comfortable?</th>
                        <th className="px-4 py-2 text-left">Would pay fee?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={12} className="px-4 py-6 text-center text-gray-500 italic">
                            Loading...
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td colSpan={12} className="px-4 py-6 text-center text-gray-500 italic">
                            No results found
                          </td>
                        </tr>
                      ) : (
                        rows.map((r, i) => (
                          <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                            <td className="px-4 py-2 font-medium">{r.full_name ?? "—"}</td>
                            <td className="px-4 py-2">{r.phone ?? "—"}</td>
                            <td className="px-4 py-2">{r.q3 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q4 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q5 ?? "—"}</td>
                            <td className="px-4 py-2">{Array.isArray(r.q6) ? r.q6.join(", ") : r.q6 ?? "—"}</td>
                            <td className="px-4 py-2">{Array.isArray(r.q7) ? r.q7.join(", ") : r.q7 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q8 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q9 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q10 ?? "—"}</td>
                            <td className="px-4 py-2">{r.q11 ?? "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          {activePage === "Workers" && (
            <section className="space-y-6">
              {/* Worker Table */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Onboarding Workers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Worker ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                        <th className="px-4 py-2 text-left">Address</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {workers.map((w: Worker, i: number) => {
                        const categories: string[] = Array.isArray(w.categories)
                          ? w.categories
                          : [];
                        return (
                          <tr
                            key={w.id}
                            className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-2 font-mono">{w.worker_code}</td>
                            <td className="px-4 py-2 font-medium">{w.full_name ?? "—"}</td>
                            <td className="px-4 py-2">{w.email ?? "—"}</td>
                            <td className="px-4 py-2">{w.phone}</td>
                            <td className="px-4 py-2">{w.address ?? "—"}</td>
                            <td className="px-4 py-2">
                              {categories.length > 0
                                ? categories
                                  .map(
                                    (c) =>
                                      SKILL_OPTIONS.find((o) => o.value === c)?.label || c
                                  )
                                  .join(", ")
                                : "—"}
                            </td>
                            <td className="px-4 py-2">
                              {w.created_at
                                ? new Date(w.created_at).toLocaleString()
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
          {activePage === "User Profile" && (
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">👤 User Profile</h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-white">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{name || "Guest User"}</p>
                    <p className="text-gray-500">{phone || "No phone available"}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Surveys</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Workers</p>
                    <p className="text-2xl font-bold text-green-600">{workers.length}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
