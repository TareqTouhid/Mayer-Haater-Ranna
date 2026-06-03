"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import mothersData from "@/data/mothers.json";
import type { Mother } from "@/lib/types";

const mothers = mothersData as Mother[];

const avatarEmojis: Record<string, string> = {
  "rokeya-begum": "👩‍🦳",
  "nurjahan-akter": "👩‍🍳",
  "firoza-khatun": "🧕",
  "salma-bano": "👵",
  "ayesha-siddiqua": "👩",
  "rehena-parveen": "🧑‍🍳",
  "hafiza-khatun": "👴",
  "shirin-sultana": "👩‍🦱",
};

const ZILLAS = ["সব", ...Array.from(new Set(mothers.map((m) => m.zilla)))];

const MOTIVATION_LABELS: Record<string, { label: string; emoji: string }> = {
  legacy: { label: "রেসিপি সংরক্ষণ", emoji: "📜" },
  income: { label: "রান্না থেকে আয়", emoji: "💚" },
  recognition: { label: "পরিচিত রাঁধুনি", emoji: "⭐" },
};

export default function MothersPage() {
  const router = useRouter();
  const [selectedZilla, setSelectedZilla] = useState("সব");
  const [search, setSearch] = useState("");

  const filtered = mothers.filter((m) => {
    const matchZilla = selectedZilla === "সব" || m.zilla === selectedZilla;
    const matchSearch =
      !search ||
      m.name.includes(search) ||
      m.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties.some((s) => s.includes(search));
    return matchZilla && matchSearch;
  });

  return (
    <div className="min-h-dvh pb-28" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-10 pb-4"
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="touch-target w-9 h-9 flex items-center justify-center rounded-xl text-lg"
            style={{ background: "var(--surface)" }}
          >
            ←
          </button>
          <div>
            <h1 className="bn text-xl font-semibold" style={{ color: "var(--text)" }}>
              আমাদের মায়েরা
            </h1>
            <p className="bn text-xs" style={{ color: "var(--muted)" }}>
              {mothers.length} জন রাঁধুনি
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-4"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="নাম বা রান্নার ধরন লিখে খোঁজো..."
          className="bn w-full rounded-xl px-4 py-3 text-sm"
          style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            outline: "none",
          }}
        />
      </motion.div>

      {/* Zilla filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="px-6 mb-5"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ZILLAS.map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZilla(z)}
              className="bn text-sm px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
              style={{
                background: selectedZilla === z ? "var(--gold)" : "var(--surface)",
                color: selectedZilla === z ? "white" : "var(--text)",
                border: selectedZilla === z ? "none" : "1px solid var(--border)",
              }}
            >
              {z}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mother cards */}
      <div className="px-6 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="bn text-sm" style={{ color: "var(--muted)" }}>কোনো মা পাওয়া যায়নি</p>
          </div>
        ) : (
          filtered.map((mother, i) => {
            const motLabel = MOTIVATION_LABELS[mother.motivation];
            return (
              <motion.div
                key={mother.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link href={`/mother/${mother.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="rounded-2xl p-4"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div
                        className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl"
                        style={{ background: "var(--surface-2)" }}
                      >
                        {avatarEmojis[mother.id] || "👩"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bn font-semibold text-base" style={{ color: "var(--text)" }}>
                            {mother.name}
                          </span>
                          {mother.verified && (
                            <span
                              className="bn text-white rounded-full px-1.5 py-0.5"
                              style={{ background: "var(--green)", fontSize: "0.6rem" }}
                            >
                              ✓ যাচাই
                            </span>
                          )}
                        </div>
                        <p className="bn text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {mother.age} বছর · {mother.zilla}
                        </p>
                        <p
                          className="bn text-sm mt-1.5 italic leading-snug"
                          style={{ color: "var(--terra)" }}
                        >
                          "{mother.philosophy}"
                        </p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {mother.specialties.map((s) => (
                        <span
                          key={s}
                          className="bn text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--surface-2)", color: "var(--muted)" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="bn text-xs" style={{ color: "var(--muted)" }}>
                        {motLabel.emoji} {motLabel.label}
                      </span>
                      <span className="bn text-xs" style={{ color: "var(--gold)" }}>
                        {mother.recipeIds.length}টি রেসিপি →
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
