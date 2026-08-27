"use client";

import { useState } from "react";
import { Download, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./AdminForms";

interface ExportButtonProps {
  filename: string;
  data: any[];
  columns: { key: string; header: string }[];
  className?: string;
  disabled?: boolean;
}

export function ExportButton({ filename, data, columns, className = "", disabled = false }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    if (data.length === 0) return;

    setExporting(true);

    try {
      const headers = columns.map((c) => c.header).join(",");
      const rows = data.map((row) =>
        columns.map((col) => {
          const value = row[col.key];
          if (value === null || value === undefined) return "";
          const str = String(value);
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(",")
      );
      const csv = [headers, ...rows].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      icon={<Download size={14} />}
      onClick={handleExport}
      disabled={disabled || data.length === 0 || exporting}
      className={className}
    >
      {exporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${variant === "danger" ? "bg-clove-100 text-clove-600" : "bg-lagoon-100 text-lagoon-600"}`}>
            {variant === "danger" ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
          </div>
          <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        </div>
        <p className="text-stone-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900">
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-full ${variant === "danger" ? "bg-clove-600 text-white hover:bg-clove-700" : "bg-lagoon-600 text-white hover:bg-lagoon-700"}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}