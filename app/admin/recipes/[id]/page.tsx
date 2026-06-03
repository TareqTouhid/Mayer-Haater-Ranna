"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { store, PendingRecipe } from "@/lib/store";

const IMP_CONFIG: Record<string, { label: string; color: string }> = {
  must: { label: "অবশ্যই", color: "#B85C38" },
  medium: { label: "ভালো হয়", color: "#D4920A" },
  optional: { label: "ঐচ্ছিক", color: "#555" },
};

export default function AdminRecipeReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<PendingRecipe | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);

  useEffect(() => {
    const all = store.getPendingRecipes();
    setRecipe(all.find((r) => r.id === id) || null);
  }, [id]);

  function handleAction(action: "approved" | "rejected") {
    store.updateRecipeStatus(id, action, note);
    setDone(action);
    setTimeout(() => router.push("/admin/recipes"), 1500);
  }

  if (!recipe) return <div className="p-8 text-white bn">পাওয়া যায়নি</div>;

  if (done) {
    return (
      <div className="p-8 flex items-center justify-center min-h-dvh">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <p className="text-5xl mb-4">{done === "approved" ? "✅" : "❌"}</p>
          <p className="bn text-white text-xl font-semibold">{done === "approved" ? "অনুমোদন করা হয়েছে" : "বাতিল করা হয়েছে"}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-2" style={{ color: "#666", fontFamily: "'DM Sans'" }}>← ফিরে যাও</button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-5">
          <h1 className="bn text-2xl font-semibold text-white">{recipe.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: "#888", fontFamily: "'DM Sans'" }}>{recipe.nameEn}</p>
          <p className="bn text-sm mt-1" style={{ color: "#D4920A" }}>{recipe.motherName} কর্তৃক</p>
          <div className="flex gap-4 mt-2">
            <span className="text-sm" style={{ color: "#666", fontFamily: "'DM Sans'" }}>⏱ {recipe.timeMinutes}m</span>
            <span className="text-sm" style={{ color: "#666", fontFamily: "'DM Sans'" }}>👥 {recipe.servings} জন</span>
            <div className="flex gap-0.5 items-center">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: j < recipe.difficulty ? "#D4920A" : "#333" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Mother Voice */}
        {recipe.motherVoiceText && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
            <p className="text-xs mb-2" style={{ color: "#555", fontFamily: "'DM Sans'" }}>MOTHER'S VOICE</p>
            <p className="bn text-sm italic leading-relaxed" style={{ color: "#B85C38" }}>"{recipe.motherVoiceText}"</p>
            {recipe.motherVoiceNote && (
              <p className="bn text-xs mt-2 font-medium" style={{ color: "#D4920A" }}>💛 "{recipe.motherVoiceNote}"</p>
            )}
          </div>
        )}

        {/* Ingredients */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <p className="text-xs mb-3" style={{ color: "#555", fontFamily: "'DM Sans'" }}>INGREDIENTS ({recipe.ingredients.length})</p>
          {recipe.ingredients.map((ing, i) => {
            const imp = IMP_CONFIG[ing.importance] || IMP_CONFIG.optional;
            return (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: imp.color }} />
                <span className="bn text-sm text-white flex-1">{ing.name}</span>
                <span className="text-xs" style={{ color: "#666", fontFamily: "'DM Sans'" }}>{ing.amount}</span>
                <span className="bn text-xs px-1.5 py-0.5 rounded" style={{ color: imp.color, background: `${imp.color}22` }}>{imp.label}</span>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <p className="text-xs mb-3" style={{ color: "#555", fontFamily: "'DM Sans'" }}>STEPS ({recipe.steps.length})</p>
          {recipe.steps.map((s, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#D4920A", color: "white" }}>{i + 1}</div>
              <div>
                <p className="bn text-sm" style={{ color: "#CCC" }}>{s.instruction}</p>
                <p className="text-xs mt-0.5" style={{ color: "#555", fontFamily: "'DM Sans'" }}>~{s.timeMinutes}m</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note + actions */}
        <div className="mb-5">
          <p className="text-xs mb-2" style={{ color: "#555", fontFamily: "'DM Sans'" }}>REVIEW NOTE</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="কোনো মন্তব্য..."
            rows={3}
            className="bn w-full rounded-xl px-4 py-3 text-sm resize-none"
            style={{ background: "#1A1A1A", color: "#CCC", border: "1px solid #2A2A2A", outline: "none", fontFamily: "'Hind Siliguri'" }} />
        </div>

        {recipe.status === "pending" && (
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleAction("approved")}
              className="flex-1 py-4 rounded-2xl bn font-semibold" style={{ background: "#4A7C59", color: "white" }}>
              ✅ অনুমোদন করো
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleAction("rejected")}
              className="flex-1 py-4 rounded-2xl bn font-semibold" style={{ background: "#1A1A1A", color: "#EF4444", border: "1px solid #EF444433" }}>
              ❌ বাতিল করো
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
