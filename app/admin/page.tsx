"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { store, PendingMother, PendingRecipe } from "@/lib/store";
import mothersData from "@/data/mothers.json";
import recipesData from "@/data/recipes.json";

export default function AdminDashboard() {
  const [mothers, setMothers] = useState<PendingMother[]>([]);
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);

  useEffect(() => {
    store.seedDemoData();
    setMothers(store.getPendingMothers());
    setRecipes(store.getPendingRecipes());
  }, []);

  const pendingMothers = mothers.filter((m) => m.status === "pending");
  const approvedMothers = mothers.filter((m) => m.status === "approved");
  const pendingRecipes = recipes.filter((r) => r.status === "pending");
  const approvedRecipes = recipes.filter((r) => r.status === "approved");

  const stats = [
    { label: "মোট মা (verified)", value: (mothersData as any[]).length, sub: "সিডেড ডেটা", color: "#D4920A" },
    { label: "মোট রেসিপি (live)", value: (recipesData as any[]).length, sub: "সিডেড ডেটা", color: "#4A7C59" },
    { label: "অনুমোদনের অপেক্ষায়", value: pendingMothers.length, sub: "মা", color: "#F59E0B", urgent: pendingMothers.length > 0 },
    { label: "রেসিপি পর্যালোচনায়", value: pendingRecipes.length, sub: "রেসিপি", color: "#B85C38", urgent: pendingRecipes.length > 0 },
  ];

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="bn text-2xl font-semibold text-white mb-1">ড্যাশবোর্ড</h1>
        <p className="text-sm" style={{ color: "#666", fontFamily: "'DM Sans'" }}>মায়ের হাতের রান্না প্ল্যাটফর্ম</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: "#1A1A1A", border: stat.urgent ? `1px solid ${stat.color}44` : "1px solid #2A2A2A" }}
          >
            {stat.urgent && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse" style={{ background: stat.color }} />
            )}
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="bn text-sm mt-1 text-white font-medium">{stat.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#555", fontFamily: "'DM Sans'" }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Pending mothers */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2A2A2A" }}>
            <h2 className="bn text-sm font-semibold text-white">অনুমোদনের অপেক্ষায় মায়েরা</h2>
            <Link href="/admin/mothers" className="text-xs" style={{ color: "#D4920A", fontFamily: "'DM Sans'" }}>সব দেখো →</Link>
          </div>
          {pendingMothers.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="bn text-sm" style={{ color: "#555" }}>কোনো অপেক্ষমান আবেদন নেই</p>
            </div>
          ) : (
            pendingMothers.map((m) => (
              <Link key={m.id} href={`/admin/mothers/${m.id}`}>
                <div className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid #1F1F1F" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "#2A2A2A" }}>👩</div>
                  <div className="flex-1 min-w-0">
                    <p className="bn text-sm font-medium text-white truncate">{m.name}</p>
                    <p className="text-xs truncate" style={{ color: "#666", fontFamily: "'DM Sans'" }}>{m.zilla} · {m.age} বছর</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ background: "#F59E0B22", color: "#F59E0B" }}>অপেক্ষায়</span>
                </div>
              </Link>
            ))
          )}
        </motion.div>

        {/* Pending recipes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2A2A2A" }}>
            <h2 className="bn text-sm font-semibold text-white">পর্যালোচনার অপেক্ষায় রেসিপি</h2>
            <Link href="/admin/recipes" className="text-xs" style={{ color: "#D4920A", fontFamily: "'DM Sans'" }}>সব দেখো →</Link>
          </div>
          {pendingRecipes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="bn text-sm" style={{ color: "#555" }}>কোনো অপেক্ষমান রেসিপি নেই</p>
            </div>
          ) : (
            pendingRecipes.map((r) => (
              <Link key={r.id} href={`/admin/recipes/${r.id}`}>
                <div className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid #1F1F1F" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "#2A2A2A" }}>🍳</div>
                  <div className="flex-1 min-w-0">
                    <p className="bn text-sm font-medium text-white truncate">{r.name}</p>
                    <p className="text-xs truncate" style={{ color: "#666", fontFamily: "'DM Sans'" }}>{r.motherName}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ background: "#B85C3822", color: "#B85C38" }}>পর্যালোচনায়</span>
                </div>
              </Link>
            ))
          )}
        </motion.div>
      </div>

      {/* Live mothers from seed */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl overflow-hidden mt-6"
        style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #2A2A2A" }}>
          <h2 className="bn text-sm font-semibold text-white">লাইভ মায়েরা (সিডেড)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2A2A" }}>
                {["নাম", "জেলা", "বয়স", "রেসিপি", "বিশেষত্ব", "স্ট্যাটাস"].map((h) => (
                  <th key={h} className="bn text-xs text-left px-5 py-3" style={{ color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(mothersData as any[]).map((m: any) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid #1A1A1A" }}>
                  <td className="bn text-sm text-white px-5 py-3">{m.name}</td>
                  <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>{m.zilla}</td>
                  <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>{m.age}</td>
                  <td className="text-sm px-5 py-3" style={{ color: "#888", fontFamily: "'DM Sans'" }}>{m.recipeIds.length}</td>
                  <td className="bn text-sm px-5 py-3" style={{ color: "#888" }}>
                    {m.specialties.slice(0, 1).join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <span className="bn text-xs px-2 py-1 rounded-full" style={{ background: "#4A7C5922", color: "#4A7C59" }}>লাইভ</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
