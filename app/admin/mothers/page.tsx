"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { store, PendingMother } from "@/lib/store";

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "অপেক্ষায়", bg: "#F59E0B22", color: "#F59E0B" },
  approved: { label: "অনুমোদিত", bg: "#4A7C5922", color: "#4A7C59" },
  rejected: { label: "বাতিল", bg: "#EF444422", color: "#EF4444" },
  suspended: { label: "স্থগিত", bg: "#88888822", color: "#888" },
};

export default function AdminMothersPage() {
  const [mothers, setMothers] = useState<PendingMother[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    store.seedDemoData();
    setMothers(store.getPendingMothers());
  }, []);

  const filtered = filter === "all" ? mothers : mothers.filter((m) => m.status === filter);

  const counts = {
    all: mothers.length,
    pending: mothers.filter((m) => m.status === "pending").length,
    approved: mothers.filter((m) => m.status === "approved").length,
    rejected: mothers.filter((m) => m.status === "rejected").length,
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="bn text-2xl font-semibold text-white mb-1">মায়েদের আবেদন</h1>
        <p className="text-sm" style={{ color: "#666", fontFamily: "'DM Sans'" }}>প্রোফাইল যাচাই ও অনুমোদন</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mt-5">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="bn text-sm px-4 py-2 rounded-xl"
            style={{
              background: filter === f ? "#D4920A" : "#1A1A1A",
              color: filter === f ? "white" : "#888",
              border: filter === f ? "none" : "1px solid #2A2A2A",
            }}>
            {f === "all" ? "সব" : STATUS_CONFIG[f].label} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 rounded-2xl overflow-hidden"
        style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="bn text-sm" style={{ color: "#555" }}>কোনো ডেটা নেই</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                  {["নাম", "জেলা", "বয়স", "বিশেষত্ব", "জমার তারিখ", "স্ট্যাটাস", ""].map((h) => (
                    <th key={h} className="bn text-xs text-left px-5 py-3" style={{ color: "#555" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG.pending;
                  return (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/5 transition-colors"
                      style={{ borderBottom: "1px solid #1F1F1F" }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: "#2A2A2A" }}>👩</div>
                          <span className="bn text-sm text-white">{m.name}</span>
                        </div>
                      </td>
                      <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>{m.zilla}</td>
                      <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>{m.age}</td>
                      <td className="bn text-sm px-5 py-3 max-w-[160px] truncate" style={{ color: "#888" }}>{m.specialties[0]}</td>
                      <td className="text-xs px-5 py-3" style={{ color: "#666", fontFamily: "'DM Sans'" }}>
                        {new Date(m.submittedAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bn text-xs px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/mothers/${m.id}`}>
                          <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "#D4920A22", color: "#D4920A", fontFamily: "'DM Sans'" }}>
                            পর্যালোচনা →
                          </span>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
