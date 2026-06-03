"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { store, PendingMother, PendingRecipe } from "@/lib/store";
import mothersData from "@/data/mothers.json";

const MOTIVATION_LABELS = {
  legacy: { label: "রেসিপি সংরক্ষণ", emoji: "📜" },
  income: { label: "রান্না থেকে আয়", emoji: "💚" },
  recognition: { label: "পরিচিত রাঁধুনি", emoji: "⭐" },
};

export default function MaDashboard() {
  const [mother, setMother] = useState<PendingMother | null>(null);
  const [recipes, setRecipes] = useState<PendingRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.seedDemoData();
    // For demo: use first pending mother or allow picking
    const all = store.getPendingMothers();
    const id = store.getCurrentMotherId();
    const found = id ? all.find((m) => m.id === id) : null;
    setMother(found || null);
    if (found) setRecipes(store.getMotherRecipes(found.id));
    setLoading(false);
  }, []);

  if (loading) return <FullLoader />;

  if (!mother) return <MaLogin onLogin={(m) => { setMother(m); setRecipes(store.getMotherRecipes(m.id)); }} />;

  const approved = recipes.filter((r) => r.status === "approved").length;
  const pending = recipes.filter((r) => r.status === "pending").length;
  const motLabel = MOTIVATION_LABELS[mother.motivation];

  return (
    <div className="min-h-dvh pb-32" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="px-6 pt-10 pb-2 flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--muted)", fontFamily: "'DM Sans'" }}>
            মায়ের রান্না · মায়ের অ্যাপ
          </p>
          <h1 className="bn text-2xl font-semibold mt-1" style={{ color: "var(--text)" }}>
            আস্সালামু আলাইকুম 🙏
          </h1>
          <p className="bn text-base font-medium" style={{ color: "var(--terra)" }}>
            {mother.name}
          </p>
        </div>
        <Link href="/ma/profile">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "var(--surface-2)" }}>
            👩
          </div>
        </Link>
      </motion.div>

      {/* Status banner */}
      {mother.status === "pending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-6 mt-4 rounded-2xl p-4"
          style={{ background: "#FEF3C7", border: "1px solid #F59E0B" }}
        >
          <p className="bn text-sm font-semibold" style={{ color: "#92400E" }}>⏳ প্রোফাইল যাচাই হচ্ছে</p>
          <p className="bn text-xs mt-1" style={{ color: "#78350F" }}>
            আমাদের টিম তোমার প্রোফাইল যাচাই করছে। এটি সাধারণত ২৪-৪৮ ঘণ্টা লাগে।
          </p>
        </motion.div>
      )}
      {mother.status === "approved" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-6 mt-4 rounded-2xl p-4"
          style={{ background: "#D1FAE5", border: "1px solid var(--green)" }}
        >
          <p className="bn text-sm font-semibold" style={{ color: "#065F46" }}>✅ প্রোফাইল অনুমোদিত</p>
          <p className="bn text-xs mt-1" style={{ color: "#064E3B" }}>
            তোমার প্রোফাইল এখন সবার কাছে দেখা যাচ্ছে।
          </p>
        </motion.div>
      )}

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mx-6 mt-5 grid grid-cols-3 gap-3"
      >
        {[
          { label: "মোট রেসিপি", value: recipes.length, emoji: "📋" },
          { label: "অনুমোদিত", value: approved, emoji: "✅" },
          { label: "অপেক্ষায়", value: pending, emoji: "⏳" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-4 text-center" style={{ background: "var(--surface)" }}>
            <p className="text-2xl">{stat.emoji}</p>
            <p className="bn text-xl font-bold mt-1" style={{ color: "var(--text)" }}>{stat.value}</p>
            <p className="bn text-xs mt-0.5" style={{ color: "var(--muted)" }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mt-5"
      >
        <Link href="/ma/recipes/new">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "var(--terra)" }}
          >
            <span className="text-4xl">📝</span>
            <div>
              <p className="bn font-semibold text-white text-base">নতুন রেসিপি যোগ করো</p>
              <p className="bn text-white/70 text-sm mt-0.5">তোমার রান্নার রেসিপি সংরক্ষণ করো</p>
            </div>
            <span className="text-white ml-auto text-xl">→</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* My recipes */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-6 mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="bn font-semibold text-base" style={{ color: "var(--text)" }}>আমার রেসিপি</h2>
          <Link href="/ma/recipes" className="bn text-xs" style={{ color: "var(--gold)" }}>সব দেখো →</Link>
        </div>

        {recipes.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface)" }}>
            <p className="text-4xl mb-3">🍳</p>
            <p className="bn text-sm" style={{ color: "var(--muted)" }}>এখনো কোনো রেসিপি নেই।<br />প্রথম রেসিপি যোগ করো!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.slice(0, 3).map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <Link href={`/ma/recipes/${recipe.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="flex-1">
                      <p className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>{recipe.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans'" }}>{recipe.nameEn}</p>
                    </div>
                    <StatusBadge status={recipe.status} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Philosophy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mt-6 rounded-2xl p-5"
        style={{ background: "var(--surface)" }}
      >
        <p className="bn text-xs mb-1" style={{ color: "var(--muted)" }}>তোমার রান্নার দর্শন</p>
        <p className="bn text-base font-medium italic" style={{ color: "var(--terra)" }}>
          "{mother.philosophy}"
        </p>
        <p className="bn text-xs mt-3" style={{ color: "var(--muted)" }}>
          {motLabel.emoji} {motLabel.label}
        </p>
      </motion.div>

      {/* Logout */}
      <div className="mx-6 mt-4">
        <button
          onClick={() => { store.setCurrentMotherId(null); setMother(null); }}
          className="bn w-full py-3 rounded-xl text-sm"
          style={{ background: "var(--surface-2)", color: "var(--muted)" }}
        >
          লগআউট
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "#FEF3C7", text: "#92400E", label: "অপেক্ষায়" },
    approved: { bg: "#D1FAE5", text: "#065F46", label: "অনুমোদিত" },
    rejected: { bg: "#FEE2E2", text: "#991B1B", label: "বাতিল" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="bn text-xs px-2 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function MaLogin({ onLogin }: { onLogin: (m: PendingMother) => void }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    store.seedDemoData();
    const all = store.getPendingMothers();
    // Demo: any phone matches, or use demo phones
    const found = all.find((m) => m.phone === phone) || (phone.length >= 6 ? all[0] : null);
    if (found) {
      store.setCurrentMotherId(found.id);
      onLogin(found);
    } else {
      setError("এই নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।");
    }
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">👩‍🍳</span>
          <h1 className="bn text-2xl font-semibold" style={{ color: "var(--text)" }}>মায়ের রান্না অ্যাপ</h1>
          <p className="bn text-sm mt-2" style={{ color: "var(--muted)" }}>তোমার রেসিপি সংরক্ষণ করো,<br />হাজার মানুষের কাছে পৌঁছে দাও।</p>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--surface)" }}>
          <p className="bn text-sm font-medium mb-3" style={{ color: "var(--text)" }}>ফোন নম্বর দিয়ে লগইন করো</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(""); }}
            placeholder="০১XXXXXXXXX"
            className="bn w-full rounded-xl px-4 py-3 text-base mb-3"
            style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)", outline: "none" }}
          />
          {error && <p className="bn text-xs text-red-600 mb-3">{error}</p>}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="bn w-full py-4 rounded-xl font-semibold text-base"
            style={{ background: "var(--gold)", color: "white" }}
          >
            লগইন করো
          </motion.button>
          <p className="bn text-xs text-center mt-3" style={{ color: "var(--muted)" }}>
            ডেমো: যেকোনো ৬+ ডিজিটের নম্বর
          </p>
        </div>

        <div className="mt-5 rounded-2xl p-5" style={{ background: "var(--surface)" }}>
          <p className="bn text-sm font-medium mb-3" style={{ color: "var(--text)" }}>নতুন মা হিসেবে যোগ দিতে চাও?</p>
          <Link href="/ma/profile">
            <div className="bn w-full py-3 rounded-xl text-center text-sm" style={{ background: "var(--surface-2)", color: "var(--text)" }}>
              প্রোফাইল তৈরি করো →
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function FullLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <motion.p animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="bn text-lg" style={{ color: "var(--muted)" }}>
        লোড হচ্ছে...
      </motion.p>
    </div>
  );
}
