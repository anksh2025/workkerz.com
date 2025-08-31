// lib/skills.ts
export const SKILL_OPTIONS = [
  { label: "Plumber", value: "plumber", icon: "🔧", rate: "₹200-500/hr" },
  { label: "Electrician", value: "electrician", icon: "⚡", rate: "₹250-600/hr" },
  { label: "Carpenter", value: "carpenter", icon: "🔨", rate: "₹300-700/hr" },
  { label: "Painter", value: "painter", icon: "🎨", rate: "₹200-450/hr" },
  { label: "Cleaner", value: "cleaner", icon: "🧹", rate: "₹150-300/hr" },
  { label: "Cook", value: "cook", icon: "🍳", rate: "₹200-400/hr" },
  { label: "Driver", value: "driver", icon: "🚗", rate: "₹300-800/hr" },
  { label: "Gardener", value: "gardener", icon: "🌱", rate: "₹200-400/hr" },
  { label: "AC Technician", value: "ac_technician", icon: "❄️", rate: "₹300-600/hr" },
  { label: "Appliance Repair", value: "appliance_repair", icon: "🛠️", rate: "₹250-500/hr" },
];


// Explicit type for worker
type Worker = {
  id: string;
  worker_code: string;
  full_name: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  categories: string[] | null;
  created_at: string | null;
};

type Contact = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  message?: string | null;
  created_at?: string | null; // if you have timestamps
};
