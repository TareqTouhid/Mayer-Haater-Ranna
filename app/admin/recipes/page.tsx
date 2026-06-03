"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { store, PendingRecipe } from "@/lib/store";

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "পর্যালোচনায়", bg: "#B85C3822", color: "#B85C38" },
  approved: { label: "অনুমোদিত", bg: "#4A7C5922", color: "#4A7C59" },
  rejected: { label: "বাতিল", bg: "#EF444422", color: "#EF4444" },
};

const DIFF_LABELS = ["", "সহজ", "মোটামুটি", "একটু কঠিন", "কঠিন", "বিশেষজ্ঞ"];

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    store.seedDemoData();
    setRecipes(store.getPendingRecipes());
  }, []);

  const filtered = filter === "all" ? recipes : recipes.filter((r) => r.status === filter);
  const counts = {
    all: recipes.length,
    pending: recipes.filter((r) => r.status === "pending").length,
    approved: recipes.filter((r) => r.status === "approved").length,
    rejected: recipes.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="bn text-2xl font-semibold text-white mb-1">রেসিপি পর্যালোচনা</h1>
        <p className="text-sm" style={{ color: "#666", fontFamily: "'DM Sans'" }}>সব রেসিপি অনুমোদনের আগে এখানে আসে</p>
      </motion.div>

      <div className="flex gap-2 mt-5">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="bn text-sm px-4 py-2 rounded-xl"
            style={{ background: filter === f ? "#D4920A" : "#1A1A1A", color: filter === f ? "white" : "#888", border: filter === f ? "none" : "1px solid #2A2A2A" }}>
            {f === "all" ? "সব" : STATUS_CONFIG[f].label} ({counts[f]})
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 rounded-2xl overflow-hidden"
        style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="bn text-sm" style={{ color: "#555" }}>কোনো রেসিপি নেই</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                  {["রেসিপি", "মা", "কঠিনত্ব", "সময়", "উপকরণ", "জমার তারিখ", "স্ট্যাটাস", ""].map((h) => (
                    <th key={h} className="bn text-xs text-left px-5 py-3" style={{ color: "#555" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid #1F1F1F" }}>
                      <td className="px-5 py-3">
                        <div>
                          <p className="bn text-sm text-white font-medium">{r.name}</p>
                          <p className="text-xs" style={{ color: "#666", fontFamily: "'DM Sans'" }}>{r.nameEn}</p>
                        </div>
                      </td>
                      <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>{r.motherName}</td>
                      <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: j < r.difficulty ? "#D4920A" : "#333" }} />
                          ))}
                        </div>
                      </td>
                      <td className="text-sm px-5 py-3" style={{ color: "#888", fontFamily: "'DM Sans'" }}>{r.timeMinutes}m</td>
                      <td className="text-sm px-5 py-3" style={{ color: "#888", fontFamily: "'DM Sans'" }}>{r.ingredients.length}</td>
                      <td className="text-xs px-5 py-3" style={{ color: "#666", fontFamily: "'DM Sans'" }}>
                        {new Date(r.submittedAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bn text-xs px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/admin/recipes/${r.id}`}>
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
