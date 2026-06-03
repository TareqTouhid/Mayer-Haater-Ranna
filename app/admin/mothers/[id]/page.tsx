"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { store, PendingMother } from "@/lib/store";

export default function AdminMotherReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [mother, setMother] = useState<PendingMother | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);

  useEffect(() => {
    const all = store.getPendingMothers();
    setMother(all.find((m) => m.id === id) || null);
  }, [id]);

  function handleAction(action: "approved" | "rejected") {
    store.updateMotherStatus(id, action, note);
    setDone(action);
    setTimeout(() => router.push("/admin/mothers"), 1500);
  }

  if (!mother) return <div className="p-8 text-white bn">পাওয়া যায়নি</div>;

  if (done) {
    return (
      <div className="p-8 flex items-center justify-center min-h-dvh">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <p className="text-5xl mb-4">{done === "approved" ? "✅" : "❌"}</p>
          <p className="bn text-white text-xl font-semibold">
            {done === "approved" ? "অনুমোদন করা হয়েছে" : "বাতিল করা হয়েছে"}
          </p>
          <p className="text-sm mt-1" style={{ color: "#666", fontFamily: "'DM Sans'" }}>ফিরে যাচ্ছি...</p>
        </motion.div>
      </div>
    );
  }

  const MOTIVATION_LABELS: Record<string, string> = {
    legacy: "📜 রেসিপি সংরক্ষণ", income: "💚 রান্না থেকে আয়", recognition: "⭐ পরিচিত হতে চান",
  };

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-2" style={{ color: "#666", fontFamily: "'DM Sans'" }}>
        ← ফিরে যাও
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: "#2A2A2A" }}>👩</div>
          <div>
            <h1 className="bn text-2xl font-semibold text-white">{mother.name}</h1>
            <p className="bn text-sm mt-1" style={{ color: "#888" }}>{mother.age} বছর · {mother.zilla}</p>
            <p className="text-sm mt-1" style={{ color: "#666", fontFamily: "'DM Sans'" }}>{mother.phone}</p>
            <span className="bn text-xs mt-2 inline-block" style={{ color: "#D4920A" }}>{MOTIVATION_LABELS[mother.motivation]}</span>
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <p className="text-xs mb-1" style={{ color: "#555", fontFamily: "'DM Sans'" }}>PHILOSOPHY</p>
          <p className="bn text-white text-base italic">"{mother.philosophy}"</p>
        </div>

        <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <p className="text-xs mb-2" style={{ color: "#555", fontFamily: "'DM Sans'" }}>STORY</p>
          <p className="bn text-sm leading-relaxed" style={{ color: "#CCC" }}>{mother.story}</p>
        </div>

        <div className="rounded-2xl p-5 mb-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <p className="text-xs mb-3" style={{ color: "#555", fontFamily: "'DM Sans'" }}>SPECIALTIES</p>
          <div className="flex flex-wrap gap-2">
            {mother.specialties.map((s) => (
              <span key={s} className="bn text-sm px-3 py-1 rounded-full" style={{ background: "#2A2A2A", color: "#CCC" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Review note */}
        <div className="mb-5">
          <p className="text-xs mb-2" style={{ color: "#555", fontFamily: "'DM Sans'" }}>REVIEW NOTE (optional)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="কোনো মন্তব্য থাকলে লিখুন..."
            rows={3}
            className="bn w-full rounded-xl px-4 py-3 text-sm resize-none"
            style={{ background: "#1A1A1A", color: "#CCC", border: "1px solid #2A2A2A", outline: "none", fontFamily: "'Hind Siliguri'" }}
          />
        </div>

        {/* Actions */}
        {mother.status === "pending" && (
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("approved")}
              className="flex-1 py-4 rounded-2xl bn font-semibold text-base"
              style={{ background: "#4A7C59", color: "white" }}
            >
              ✅ অনুমোদন করো
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("rejected")}
              className="flex-1 py-4 rounded-2xl bn font-semibold text-base"
              style={{ background: "#1A1A1A", color: "#EF4444", border: "1px solid #EF444433" }}
            >
              ❌ বাতিল করো
            </motion.button>
          </div>
        )}

        {mother.status !== "pending" && (
          <div className="rounded-2xl p-4" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
            <p className="text-sm" style={{ color: "#888", fontFamily: "'DM Sans'" }}>
              Status: <strong style={{ color: mother.status === "approved" ? "#4A7C59" : "#EF4444" }}>{mother.status}</strong>
              {mother.reviewedAt && ` · ${new Date(mother.reviewedAt).toLocaleDateString("bn-BD")}`}
            </p>
            {mother.reviewNote && <p className="bn text-sm mt-1" style={{ color: "#888" }}>{mother.reviewNote}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
