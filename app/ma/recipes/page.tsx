"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { store, PendingRecipe } from "@/lib/store";

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "#FEF3C7", text: "#92400E", label: "অপেক্ষায়" },
  approved: { bg: "#D1FAE5", text: "#065F46", label: "অনুমোদিত" },
  rejected: { bg: "#FEE2E2", text: "#991B1B", label: "বাতিল" },
};

export default function MaRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = store.getCurrentMotherId();
    if (!id) { router.push("/ma"); return; }
    const all = store.getMotherRecipes(id);
    setRecipes(all);
    setLoading(false);
  }, [router]);

  const filtered = filter === "all" ? recipes : recipes.filter((r) => r.status === filter);

  if (loading) return (
    <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <motion.p animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
        className="bn text-lg" style={{ color: "var(--muted)" }}>লোড হচ্ছে...</motion.p>
    </div>
  );

  return (
    <div className="min-h-dvh pb-28" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="touch-target w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: "var(--surface)" }}
        >←</button>
        <div>
          <h1 className="bn font-semibold text-base" style={{ color: "var(--text)" }}>আমার রেসিপি</h1>
          <p className="bn text-xs" style={{ color: "var(--muted)" }}>{recipes.length}টি রেসিপি</p>
        </div>
        <Link href="/ma/recipes/new" className="ml-auto">
          <div
            className="bn text-sm px-4 py-2 rounded-xl font-medium"
            style={{ background: "var(--gold)", color: "white" }}
          >
            + নতুন
          </div>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => {
            const count = f === "all" ? recipes.length : recipes.filter(r => r.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="bn text-xs px-3 py-1.5 rounded-full flex-shrink-0"
                style={{
                  background: filter === f ? "var(--gold)" : "var(--surface)",
                  color: filter === f ? "white" : "var(--muted)",
                  border: filter === f ? "none" : "1px solid var(--border)",
                }}
              >
                {f === "all" ? "সব" : f === "pending" ? "অপেক্ষায়" : f === "approved" ? "অনুমোদিত" : "বাতিল"}
                {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe list */}
      <div className="px-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: "var(--surface)" }}>
            <p className="text-4xl mb-3">🍳</p>
            <p className="bn text-sm mb-4" style={{ color: "var(--muted)" }}>
              {filter === "all" ? "এখনো কোনো রেসিপি নেই।" : "এই ক্যাটাগরিতে কোনো রেসিপি নেই।"}
            </p>
            {filter === "all" && (
              <Link href="/ma/recipes/new">
                <div
                  className="bn inline-block py-3 px-6 rounded-xl text-sm font-medium"
                  style={{ background: "var(--gold)", color: "white" }}
                >
                  প্রথম রেসিপি যোগ করো
                </div>
              </Link>
            )}
          </div>
        ) : (
          filtered.map((recipe, i) => {
            const s = STATUS_MAP[recipe.status] || STATUS_MAP.pending;
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4"
                style={{ background: "var(--surface)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {recipe.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans'" }}>
                      {recipe.nameEn}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {recipe.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bn text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--surface-2)", color: "var(--muted)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className="bn text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>

                {recipe.reviewNote && (
                  <div
                    className="mt-3 p-3 rounded-xl"
                    style={{ background: recipe.status === "rejected" ? "#FEE2E2" : "#D1FAE5" }}
                  >
                    <p className="bn text-xs" style={{ color: recipe.status === "rejected" ? "#991B1B" : "#065F46" }}>
                      💬 {recipe.reviewNote}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="bn text-xs" style={{ color: "var(--muted)" }}>
                    ⏱ {recipe.timeMinutes} মিনিট
                  </span>
                  <span className="bn text-xs" style={{ color: "var(--muted)" }}>
                    👥 {recipe.servings} জন
                  </span>
                  <span className="bn text-xs ml-auto" style={{ color: "var(--muted)" }}>
                    {new Date(recipe.submittedAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
