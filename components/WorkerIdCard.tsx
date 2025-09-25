"use client";

import { Download, Share2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { supabase } from "../lib/supabaseClient";

interface WorkerIdCardProps {
  workerCode: string;
  showButtons?: boolean; // NEW: control button visibility
}

interface Worker {
  full_name: string;
  address: string;
  dob?: string;
  photo_url?: string;
  skills?: string[] | string;       // <-- keep both for compatibility
  categories?: string[] | string;   // <-- support categories column too
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

  // Fix Skills/Categories display
  let skillsDisplay = "";
  const categories = worker.skills || worker.categories; // prefer skills if available
  if (Array.isArray(categories)) {
    skillsDisplay = categories.join(", ");
  } else if (typeof categories === "string") {
    skillsDisplay = categories;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ID Card */}
      <div
        ref={cardRef}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border"
      >
        {/* Top Header */}
        <div className="bg-blue-600 text-white flex justify-between items-center px-2 py-1">
          <img src="/logo with name.png" alt="Workkerz Logo" className="w-32 sm:w-40 h-auto" />
        </div>

        {/* Card Body */}
        <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-blue-100">
          {/* Photo */}
          <div className="flex-shrink-0 self-center md:self-start">
            {worker.photo_url ? (
              <img
                src={worker.photo_url}
                alt={worker.full_name}
                className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 bg-gray-200 flex items-center justify-center text-xs text-gray-500 border-2 border-dashed rounded-lg">
                Photo
              </div>
            )}
          </div>

          {/* Worker Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {worker.full_name}
            </h2>

            {skillsDisplay && (
              <p className="text-xl sm:text-base md:text-lg text-gray-600 font-medium mb-4">
                {skillsDisplay}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs sm:text-sm">
              <p><span className="font-semibold">ID:</span> {workerCode}</p>
              <p><span className="font-semibold">Address:</span> {worker.address}</p>
              <p><span className="font-semibold">DOB:</span> {formattedDob}</p>
              <p><span className="font-semibold">Valid Till:</span> {expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Barcode + Footer */}
        <div className="bg-white px-4 sm:px-6 py-4 border-t">
          <div className="flex justify-center mb-2">
            <Barcode value={workerCode} width={2} height={60} displayValue={false} />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span className="font-semibold">Workkerz.com</span>
            <span className="italic text-green-700 font-medium flex items-center gap-1">
              ✅ Verified Worker ID
            </span>
          </div>
        </div>
      </div>

      {/* Download & Share */}
      {/* Download & Share */}
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
