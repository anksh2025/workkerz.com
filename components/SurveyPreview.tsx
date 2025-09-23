"use client";
import React from "react";

export function SurveyPreview({
  form,
  onClose,
  onConfirm,
  submitting,
}: {
  form: Record<string, any>;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Preview Your Answers</h2>
        <div className="grid gap-2 max-h-[60vh] overflow-y-auto">
          {Object.entries(form).map(([k, v]) => (
            <div key={k} className="flex justify-between items-start bg-slate-50 p-2 rounded">
              <div className="text-sm text-slate-600">{k.replace(/_/g, " ")}</div>
              <div className="text-sm font-medium">{Array.isArray(v) ? v.join(", ") : String(v)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700"
          >
            {submitting ? "Submitting..." : "Confirm & Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
