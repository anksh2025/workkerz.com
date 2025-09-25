"use client";

import { useEffect, useState } from "react";
import { SKILL_OPTIONS } from "../../../lib/skills";
import { supabase } from "../../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import WorkerIdCard from "../../../components/WorkerIdCard";


import {
  Users,
  ClipboardList,
  X,
  MessageSquare,
  Search,
  Home,
  User,
  Table,
  Download,
  Star
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";



// 🛠 For export
import * as XLSX from "xlsx";

interface Survey {
  id: number;
  created_at: string;
  full_name: string;
  age: string;
  gender: string;
  location: string;
  mobile: string;
  bank_account: string;
  upi: string;
  work_type: string[];            // json[]
  find_work: string[];            // json[]
  work_frequency: string;
  comfortable_with_apps: string;
  biggest_problem: string[];      // json[]
  smartphone: string;
  use_workkerz: string;
  payment_fraud: string;
  features: string[];             // json[]
  payment_method: string;
  register_now: string;
  rating?: number | null;
}

interface Worker {
  id: string;                  // custom WrkXXXX format
  worker_code: string;         // worker code (Wrk0001 etc.)
  full_name: string;
  dob?: string;
  phone: string;

  email?: string | null;
  address?: string | null;

  categories: string[];        // multiple skill categories
  expected_payment?: number | null;  // 💰 new field
  duration_type?: string | null;     // ⏳ new field

  status?: string | null;
  created_at: string;           // ISO date string
}


interface Contact {
  id: number;
  full_name: string | null;
  phone: string | null;
  email?: string | null;
  address?: string | null;
  message?: string | null;
  created_at?: string | null; // optional – some DBs don't have this
  inserted_at?: string | null; // optional fallback
  createdAt?: string | null;   // optional fallback
}

// ---------------- Component ----------------

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Survey[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [contact, setContact] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [contactLoading, setContactLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [workersLoading, setWorkersLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [selectedRow, setSelectedRow] = useState<any | null>(null);


  // ---------------- Fetch Surveys ----------------

  async function fetchData(filters = false) {
    let query = supabase
      .from("survey_responses")
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
      .channel("survey_responses_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "survey_responses" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 📊 Stats


  const lineData = [
    { name: "Mon", value: 20 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 32 },
    { name: "Thu", value: 60 },
    { name: "Fri", value: 80 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 70 },
  ];

  const totalResponses = rows.length;

  // 1️⃣ State for fetched rating data
  const [ratingData, setRatingData] = useState<{
    average: number;
    count: number;
    breakdown: number[];
  }>({ average: 0, count: 0, breakdown: [0, 0, 0, 0, 0] });

  // 2️⃣ Fetch ratings from API
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch("/api/ratings");
        if (!res.ok) throw new Error("Failed to fetch ratings");
        const data = await res.json();
        setRatingData({
          average: data.average,
          count: data.count,
          breakdown: data.breakdown || [0, 0, 0, 0, 0],
        });
      } catch (err) {
        console.error("Error loading ratings:", err);
        setRatingData({
          average: 0,
          count: 0,
          breakdown: [0, 0, 0, 0, 0],
        });
      }
    };
    fetchRatings();
  }, []);

  const workFrequencyStats = rows.reduce((acc: Record<string, number>, r) => {
    acc[r.work_frequency] = (acc[r.work_frequency] || 0) + 1;
    return acc;
  }, {});

  const appComfortStats = rows.reduce((acc: Record<string, number>, r) => {
    acc[r.comfortable_with_apps] = (acc[r.comfortable_with_apps] || 0) + 1;
    return acc;
  }, {});

  const dailyResponses = rows.reduce((acc: Record<string, number>, r) => {
    const date = new Date(r.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dailyData = Object.entries(dailyResponses).map(([date, count]) => ({
    date,
    count,
  }));

  // ---------------- Export ----------------

  const exportCSV = () => {
    const csv = [
      [
        "Date", "Name", "Age", "Gender", "Location", "Mobile", "Bank Account", "UPI", "Work Type",
        "Find Work", "Work Frequency", "Apps Comfortable", "Biggest Problem", "Smartphone",
        "Use Workkerz", "Payment Fraud", "Features", "Payment Method", "Register Now", "Rating"
      ],
      ...rows.map((r) => [
        r.created_at ? new Date(r.created_at).toLocaleString() : "—",
        r.full_name ?? "—", r.age ?? "—", r.gender ?? "—", r.location ?? "—",
        r.mobile ?? "—", r.bank_account ?? "—", r.upi ?? "—",
        Array.isArray(r.work_type) ? r.work_type.join(", ") : r.work_type ?? "—",
        Array.isArray(r.find_work) ? r.find_work.join(", ") : r.find_work ?? "—",
        r.work_frequency ?? "—", r.comfortable_with_apps ?? "—",
        Array.isArray(r.biggest_problem) ? r.biggest_problem.join(", ") : r.biggest_problem ?? "—",
        r.smartphone ?? "—", r.use_workkerz ?? "—",
        r.payment_fraud ?? "—", Array.isArray(r.features) ? r.features.join(", ") : r.features ?? "—",
        r.payment_method ?? "—", r.register_now ?? "—", r.rating ?? "—",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "survey_responses.csv";
    link.click();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
    XLSX.writeFile(workbook, "survey_responses.xlsx");
  };


  // ---------------- Fetch Workers ----------------

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

 const handleDownloadCard = async (workerCode: string) => {
  // Create a container for the hidden card
  const cardContainer = document.createElement("div");
  // Make container invisible and no margin
  cardContainer.style.position = "fixed";
  cardContainer.style.top = "0";
  cardContainer.style.left = "0";
  cardContainer.style.zIndex = "-1000";
  cardContainer.style.background = "transparent";
  document.body.appendChild(cardContainer);

  // Render WorkerIdCard with buttons hidden
  const Card = () => <WorkerIdCard workerCode={workerCode} showButtons={false} />;

  // Mount React component manually
  const ReactDOM = await import("react-dom/client");
  const root = ReactDOM.createRoot(cardContainer);
  root.render(<Card />);

  // Wait for rendering
  await new Promise((res) => setTimeout(res, 500));

  // Capture screenshot with transparent background
  if (cardContainer.firstChild) {
    const canvas = await html2canvas(cardContainer.firstChild as HTMLElement, {
      scale: 5,
      backgroundColor: null, // makes background transparent
    });
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${workerCode}_ID.png`;
    link.click();
  }

  // Cleanup
  root.unmount();
  document.body.removeChild(cardContainer);
};



////fetch contacts

  async function fetchContact() {
    setContactLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false }); // ✅ safe even if created_at is missing

    if (error) {
      console.error("Error fetching contacts:", error);
      setContact([]);
    } else {
      setContact(data ?? []);
    }
    setContactLoading(false);
  }

  // 4) Live subscription
  useEffect(() => {
    let isMounted = true;

    fetchContact();

    const channel = supabase
      .channel("contacts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, () => {
        if (isMounted) fetchContact();
      })
      .subscribe();

    return () => {
      isMounted = false;
      // call async but don’t return it
      supabase.removeChannel(channel).catch(console.error);
    };
  }, []);


  // 5) Helper for timestamps (works with any column name)
  const getTs = (c: Contact) => c.created_at ?? c.inserted_at ?? c.createdAt ?? null;

  // Removed duplicate setSelectedContact function to avoid identifier conflict with useState setter.

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-xl flex flex-col rounded-r-3xl overflow-hidden">
        {/* Brand / Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/20">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            ✨
          </div>
          <h1 className="text-lg font-semibold tracking-wide">Creative Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {[
            { label: "Dashboard", icon: <Home size={20} /> },
            { label: "User Help", icon: <User size={20} /> },
            { label: "Survey List", icon: <Table size={20} /> },
            { label: "Workers", icon: <Users size={20} /> },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActivePage(item.label)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 
          ${activePage === item.label
                  ? "bg-white text-indigo-700 font-semibold shadow-lg"
                  : "hover:bg-white/20 hover:text-white/90"
                }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/20 text-xs text-white/60">
          © 2025 Creative Admin
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Dashboard Body */}
        <main className="p-6 space-y-6 overflow-y-auto">
          {/* ✅ Dashboard Page */}
          {activePage === "Dashboard" && (
            <div className="space-y-10">
              {/* 🔹 PART 1: Survey Section */}
              <section className="space-y-8">
                {/* === Survey Stats === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                      <ClipboardList className="w-10 h-10 opacity-90" />
                      <div>
                        <p className="text-sm opacity-80">Total Surveys</p>
                        <p className="text-3xl font-bold">{totalResponses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                      <Users className="w-10 h-10 opacity-90" />
                      <div>
                        <p className="text-sm opacity-80">Work Frequency Types</p>
                        <p className="text-3xl font-bold">{Object.keys(workFrequencyStats).length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                      <Star className="w-10 h-10 opacity-90" />
                      <div>
                        <p className="text-sm opacity-80">Avg Rating</p>
                        <p className="text-3xl font-bold">{ratingData.average}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* === Charts Section === */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Area Chart */}
                  <div className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                        <span className="text-2xl">📈</span> Daily Activity
                      </h2>
                      <span className="text-sm text-gray-500">Last 7 days</span>
                    </div>

                    {/* Chart */}
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={lineData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#4b5563" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
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

                    {/* Footer / Stats */}
                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                      <span>Min: {Math.min(...lineData.map(d => d.value))}</span>
                      <span>Max: {Math.max(...lineData.map(d => d.value))}</span>
                      <span>Avg: {Math.round(lineData.reduce((a, b) => a + b.value, 0) / lineData.length)}</span>
                    </div>
                  </div>


                  {/* Right side 3 charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                      <h2 className="font-semibold mb-4">Work Frequency</h2>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={Object.entries(workFrequencyStats).map(([k, v]) => ({ name: k, value: v }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                      <h2 className="font-semibold mb-4">App Comfort</h2>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={Object.entries(appComfortStats).map(([k, v]) => ({ name: k, value: v }))}
                            cx="50%"
                            cy="50%"
                            label
                            outerRadius={80}
                            dataKey="value"
                          >
                            {Object.keys(appComfortStats).map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={["#10b981", "#f59e0b", "#3b82f6", "#ef4444"][idx % 4]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                      <h2 className="font-semibold mb-4">Daily Responses</h2>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dailyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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
            <div className="relative flex flex-col h-full">
              {/* Sticky Header with Filter Toggle */}
              <header className="bg-white/80 rounded-full sbackdrop-blur-md border-b border-indigo-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white shadow-sm hover:shadow-md hover:border-indigo-400 transition"
                >
                  <Search size={18} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    {showFilters ? "Hide Filters" : "Search / Filter"}
                  </span>
                </button>
              </header>

              {/* Collapsible Filters */}
              {showFilters && (
                <div className="sticky top-[64px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-lg px-6 py-6 rounded-b-2xl overflow-x-auto transition-all">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Search className="text-indigo-500" size={22} /> Search Filters
                    </h2>
                    <button
                      onClick={() => { setName(""); setPhone(""); setFromDate(""); setToDate(""); }}
                      className="text-sm text-red-500 hover:text-red-600 font-semibold transition"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Filter Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: "Name", value: name, setter: setName, placeholder: "Search by Name" },
                      { label: "Phone", value: phone, setter: setPhone, placeholder: "Search by Phone" },
                      { label: "From Date", value: fromDate, setter: setFromDate, type: "date" },
                      { label: "To Date", value: toDate, setter: setToDate, type: "date" },
                    ].map((filter, i) => (
                      <div key={i}>
                        <label className="text-sm text-gray-600 mb-1 block font-medium">{filter.label}</label>
                        <input
                          type={filter.type || "text"}
                          value={filter.value}
                          onChange={(e) => filter.setter(e.target.value)}
                          placeholder={filter.placeholder || ""}
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 shadow-sm transition"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() => fetchData(true)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-indigo-600 transition-all"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => fetchData(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-200 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
              {/* Table Section - Scrollable */}
              <section className="flex-1 overflow-auto px-6 pt-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      📋 Recent Submissions
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={exportCSV}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 text-sm shadow"
                      >
                        <Download size={16} /> CSV
                      </button>
                      <button
                        onClick={exportExcel}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 text-sm shadow"
                      >
                        <Download size={16} /> Excel
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-4">
                    {loading ? (
                      <div className="col-span-full text-center text-gray-500 py-6 animate-pulse">
                        Loading...
                      </div>
                    ) : rows.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 py-6">
                        No data found
                      </div>
                    ) : (
                      rows.map((r) => {
                        const formattedDate = new Date(r.created_at).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });

                        return (
                          <motion.div
                            key={r.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 
                     dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 
                     border border-gray-200 dark:border-gray-700 rounded-3xl 
                     shadow-lg hover:shadow-2xl transition-all duration-300 
                     transform hover:-translate-y-2 p-6 flex flex-col gap-4"
                          >
                            {/* Top Row: Name + Rating */}
                            <div className="flex justify-between items-center">
                              <h2 className="text-lg font-extrabold tracking-wide text-gray-900 dark:text-white">
                                {r.full_name}
                              </h2>
                              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 
                             text-indigo-800 text-sm font-semibold shadow">
                                ⭐ {ratingData.average}
                              </span>
                            </div>

                            {/* Middle Row: Info in Two Columns */}
                            <div className="flex justify-between items-start mt-2 gap-4">
                              {/* Left Column */}
                              <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                  {r.age} • {r.gender} • {r.location}
                                </p>
                                <span className="inline-flex items-center gap-2 w-fit px-3 py-1 text-xs font-medium 
                               text-indigo-700 bg-indigo-50 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                                  📱 {r.mobile}
                                </span>
                              </div>

                              {/* Right Column */}
                              <div className="flex flex-col items-end text-right gap-2">
                                <span className="text-xs text-gray-400">{formattedDate}</span>
                                <button
                                  onClick={() => setSelectedRow(r)}
                                  className="mt-4 font-medium text-sm px-4 py-2 rounded-full bg-indigo-100 
                       text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300"
                                >
                                  Show More
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>


                  {/* Modal for Details */}
                  <AnimatePresence>
                    {selectedRow && (
                      <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedRow(null)}
                      >
                        <motion.div
                          className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 
                   dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                   rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[85vh] 
                   overflow-y-auto border border-gray-200 dark:border-gray-700"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Close button */}
                          <button
                            onClick={() => setSelectedRow(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </button>

                          {/* Header */}
                          <div className="flex items-center gap-4 mb-8">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {selectedRow.full_name?.[0]}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedRow.full_name}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedRow.age} • {selectedRow.gender} • {selectedRow.location}
                              </p>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { label: "🏦 Bank", value: selectedRow.bank_account },
                              { label: "💳 UPI", value: selectedRow.upi },
                              { label: "🛠️ Work Type", value: Array.isArray(selectedRow.work_type) ? selectedRow.work_type.join(", ") : selectedRow.work_type },
                              { label: "🔍 Find Work", value: Array.isArray(selectedRow.find_work) ? selectedRow.find_work.join(", ") : selectedRow.find_work },
                              { label: "📅 Frequency", value: selectedRow.work_frequency },
                              { label: "📲 Apps", value: selectedRow.comfortable_with_apps },
                              { label: "⚠️ Problem", value: Array.isArray(selectedRow.biggest_problem) ? selectedRow.biggest_problem.join(", ") : selectedRow.biggest_problem },
                              { label: "📱 Smartphone", value: selectedRow.smartphone },
                              { label: "👷 Use Workkerz", value: selectedRow.use_workkerz },
                              { label: "💸 Payment Fraud", value: selectedRow.payment_fraud },
                              { label: "✨ Features", value: Array.isArray(selectedRow.features) ? selectedRow.features.join(", ") : selectedRow.features },
                              { label: "💰 Payment Method", value: selectedRow.payment_method },
                              { label: "📝 Register Now", value: selectedRow.register_now },
                            ].map((item, i) => (
                              <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-1"
                              >
                                <span className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
                                  {item.label}
                                </span>
                                <span className="text-base font-medium text-indigo-700 dark:text-indigo-300 pl-3">
                                  {item.value || "—"}
                                </span>
                              </div>
                            ))}

                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>




                </div>
              </section>
            </div>
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
                        <th className="p-3 border">DOB</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                        <th className="px-4 py-2 text-left">Address</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Expected Payment</th>
                        <th className="px-4 py-2 text-left">Duration</th>
                        <th className="px-4 py-2 text-left">Created At</th>
                        <th className="p-3 border">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {workers.map((w: Worker, i: number) => {
                        const categories: string[] = Array.isArray(w.categories) ? w.categories : [];
                        return (
                          <tr key={w.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 font-mono">{w.worker_code}</td>
                            <td className="px-4 py-2 font-medium">{w.full_name ?? "—"}</td>
                            <td className="p-3 border">
                              {w.dob ? new Date(w.dob).toLocaleDateString("en-GB") : "-"}
                            </td>
                            <td className="px-4 py-2">{w.phone}</td>
                            <td className="px-4 py-2">{w.address ?? "—"}</td>
                            <td className="px-4 py-2">
                              {categories.length > 0
                                ? categories
                                  .map((c) => SKILL_OPTIONS.find((o) => o.value === c)?.label || c)
                                  .join(", ")
                                : "—"}
                            </td>
                            <td className="px-4 py-2">{w.expected_payment ? `₹${w.expected_payment}` : "—"}</td>
                            <td className="px-4 py-2">{w.duration_type ?? "—"}</td>
                            <td className="px-4 py-2">{w.created_at ? new Date(w.created_at).toLocaleString() : "—"}</td>
                             <td className="p-3 border text-center">
            <button
              onClick={() => handleDownloadCard(w.worker_code)}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download className="w-5 h-5" />
            </button>
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

          {/* ✅ User Help Page */}

          {activePage === "User Help" && (
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">👤 Help Dashboard</h2>
                    <p className="text-sm text-gray-500">Manage user contacts & latest queries</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{contact.length}</span> contacts
                  </div>
                </div>

                {contactLoading ? (
                  <p className="text-gray-500">Loading contacts...</p>
                ) : contact.length === 0 ? (
                  <p className="text-gray-500">No contact data found.</p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: All users table */}
                    <div className="col-span-2 overflow-x-auto">
                      <h3 className="text-md font-semibold mb-3 text-gray-700">All User Details</h3>
                      <div className="rounded-lg border overflow-hidden">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Phone</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Address</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Message</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Joined</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y">
                            {contact.map((c) => (
                              <tr
                                key={c.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedContact(c)}
                              >
                                <td className="px-4 py-3">{(c as any).full_name ?? "—"}</td>
                                <td className="px-4 py-3">{(c as any).phone ?? "—"}</td>
                                <td className="px-4 py-3">{(c as any).email ?? "—"}</td>
                                <td className="px-4 py-3">{(c as any).address ?? "—"}</td>
                                <td className="px-4 py-3 max-w-[30ch] text-ellipsis overflow-hidden whitespace-nowrap">
                                  {(c as any).message ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {getTs(c) ? new Date(getTs(c)!).toLocaleDateString() : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Floating message icon + panel */}
                    <div className="relative">
                      {/* Floating Message Icon */}
                      <button
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
                      >
                        <MessageSquare className="w-6 h-6" />
                      </button>

                      {/* Panel (toggle on click) */}
                      {open && (
                        <div className="fixed bottom-20 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border p-4 z-50 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              💬 User Queries
                              <span className="ml-2 text-sm text-gray-500">({contact.length})</span>
                            </h3>
                            <button
                              onClick={() => setOpen(false)}
                              className="text-gray-500 hover:text-gray-700"
                              aria-label="Close"
                            >
                              <X />
                            </button>
                          </div>

                          <div className={`space-y-3 ${contact.length >= 5 ? "max-h-[420px] overflow-y-auto pr-2" : ""}`}>
                            {/* show newest first */}
                            {contact.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => setSelectedContact(c)}
                                className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col"
                              >
                                <p className="text-sm text-gray-800 italic truncate">“{(c as any).message ?? "No message"}”</p>
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                  <span>{getTs(c) ? new Date(getTs(c)!).toLocaleString() : ""}</span>
                                  <span className="font-medium text-indigo-600">— {(c as any).full_name ?? "Anonymous"}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Contact Modal */}
              {selectedContact && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{(selectedContact as any).full_name ?? "Anonymous"}</h4>
                        <p className="text-sm text-gray-500">{(selectedContact as any).phone ?? ""}</p>
                      </div>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                      >
                        <X />
                      </button>
                    </div>

                    <div className="mt-4 text-gray-700">
                      <p className="italic">“{(selectedContact as any).message ?? "No message"}”</p>
                      <div className="mt-4 text-sm text-gray-500">
                        <div>Email: {(selectedContact as any).email ?? "—"}</div>
                        <div>Address: {(selectedContact as any).address ?? "—"}</div>
                        <div className="mt-2">
                          <span className="font-medium">Submitted:</span>{" "}
                          {getTs(selectedContact) ? new Date(getTs(selectedContact)!).toLocaleString() : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <a
                        href={`mailto:${(selectedContact as any).email ?? ""}?subject=Re:%20Your%20message%20to%20Workkerz`}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Reply
                      </a>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="inline-flex items-center px-4 py-2 rounded-lg border"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
