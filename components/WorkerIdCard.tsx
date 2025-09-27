"use client";

import { Download, Share2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { supabase } from "../lib/supabaseClient";

interface WorkerIdCardProps {
  workerCode: string;
  showButtons?: boolean;
}

interface Worker {
  full_name: string;
  address: string;
  dob?: string;
  photo_url?: string;
  category?: string;          // "Worker" or "Contractor"
  sub_category?: string | null;
  skills?: string[] | string;
}

export default function WorkerIdCard({ workerCode, showButtons = true }: WorkerIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const expiry = new Date(today);
  expiry.setFullYear(today.getFullYear() + 2);
  const expiryDate = expiry.toISOString().split("T")[0];

  useEffect(() => {
    const fetchWorker = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .eq("worker_code", workerCode)
        .single();

      if (error) {
        console.error("Error fetching worker:", error.message);
        setWorker(null);
      } else {
        setWorker(data);
      }
      setLoading(false);
    };

    if (workerCode) fetchWorker();
  }, [workerCode]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${worker?.full_name || workerCode}_ID.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${worker?.full_name || workerCode}_ID.png`, {
            type: "image/png",
          });
          await navigator.share({
            title: "Workkerz ID Card",
            files: [file],
          });
        }
      });
    } else {
      alert("Share not supported on this browser.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!worker) return <p className="text-center text-red-500">Worker not found ❌</p>;

  // Format DOB
  const formattedDob = worker.dob ? new Date(worker.dob).toLocaleDateString("en-GB") : "";

  // Format Skills
  let skillsDisplay = "";
  if (worker.skills) {
    if (Array.isArray(worker.skills)) {
      skillsDisplay = worker.skills.join(", ");
    } else {
      skillsDisplay = worker.skills;
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ID Card */}
      <div
        ref={cardRef}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border"
      >
        {/* Header */}
        <div className="bg-blue-300 text-white flex justify-between items-center px-2 py-1">
          {/* Logo */}
          <img src="/logo with name.png" alt="Workkerz Logo" className="w-32 sm:w-40 h-auto" />

          {/* Verified ID badge */}
          <span className="italic text-green-200 font-light text-sm flex items-center gap-1">
            ✅ Verified ID
          </span>
        </div>


        {/* Body */}
        <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-blue-100">
          {/* Photo */}
          <div className="flex-shrink-0 self-center md:self-start">
            {worker.photo_url ? (
              <img
                src={worker.photo_url}
                alt={worker.full_name}
                className="w-24 h-24 sm:w-28 sm:h-36 md:w-32 md:h-40 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 bg-gray-200 flex items-center justify-center text-xs text-gray-500 border-2 border-dashed rounded-lg">
                Photo
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Name & ID */}
            <div className="text-center md:text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {worker.full_name}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                <span className="font-semibold">ID:</span> {workerCode}
              </p>
            </div>

            {/* Category / Sub-category */}
            <div className="mt-1 mb-2 text-gray-700 text-sm">
              <div className="inline-flex items-center gap-2">
                <span className="text-indigo-600 font-semibold text-base">{worker.category}</span>
                {worker.category === "Contractor" && worker.sub_category && (
                  <span className="text-green-600 text-sm font-medium">({worker.sub_category})</span>
                )}
                {worker.category === "Worker" && skillsDisplay && (
                <p className="text-sm">
                  Skills: <span className="text-gray-600">{skillsDisplay}</span>
                </p>
              )}
              </div>
            </div>


            {/* Address / DOB / Valid Till */}
            <div className="mt-4 space-y-3 text-sm sm:text-sm">
              <p>
                <span className="font-light text-sm">Address:</span> {worker.address}
              </p>

              <div className="flex flex-wrap gap-16 text-xs sm:text-sm">
                <p>
                  <span className="font-light text-sm">DOB:</span> {formattedDob}
                </p>
                <p>
                  <span className="font-light text-sm">Valid Till:</span> {expiryDate}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white px-4 sm:px-6 py-2 border-t">
          <div className="flex justify-center mb-1">
            <Barcode value={workerCode} width={2} height={40} displayValue={false} />
          </div>
        </div>

      </div>

      {/* Buttons */}
      {showButtons !== false && (
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="p-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition group"
          >
            <Download className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-6" />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Share2 className="w-6 h-6 animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
}
