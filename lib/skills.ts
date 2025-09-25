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

type SurveyRow = {
  id: number;
  full_name: string;
  age: string;
  gender: string;
  location: string;
  mobile: string;
  bank_account: string;
  upi: string;
  work_type: string[];
  find_work: string[];
  work_frequency: string;
  comfortable_with_apps: string;
  smartphone: string;
  use_workkerz: string;
  payment_fraud: string;
  features: string[];
  payment_method: string;
  register_now: string;
};

type Props = {
  rows: SurveyRow[];
  loading?: boolean;
};
// Explicit type for worker
type Worker = {
  id: string;                 // Unique identifier (UUID from DB)
  worker_code: string;        // Custom worker code (non-null)
  full_name?: string | null;  // Full name (optional)
  email?: string | null;      // Email address (optional)
  phone: string;               // Phone number (required)
  address?: string | null;    // Address (optional)
  categories?: string[] | null; // Worker categories/tags (optional)
  created_at?: string | null; // ISO timestamp when created (optional)
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
