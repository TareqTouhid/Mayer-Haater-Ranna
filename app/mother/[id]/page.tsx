"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import mothersData from "@/data/mothers.json";
import recipesData from "@/data/recipes.json";
import type { Mother, Recipe } from "@/lib/types";

const MOTIVATION_LABELS = {
  legacy: { label: "রেসিপি সংরক্ষণ", color: "var(--terra)", emoji: "📜" },
  income: { label: "রান্না থেকে আয়", color: "var(--green)", emoji: "💚" },
  recognition: { label: "পরিচিত রাঁধুনি", color: "var(--gold)", emoji: "⭐" },
};

const DIFFICULTY_LABELS = ["", "সহজ", "মোটামুটি", "একটু কঠিন", "কঠিন", "বিশেষজ্ঞ"];

export default function MotherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const mother = (mothersData as Mother[]).find((m) => m.id === id);
  if (!mother) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="bn text-lg" style={{ color: "var(--muted)" }}>পাওয়া যায়নি</p>
      </div>
    );
  }

  const recipes = (recipesData as Recipe[]).filter((r) => mother.recipeIds.includes(r.id));
  const motivationMeta = MOTIVATION_LABELS[mother.motivation];
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

  return (
    <div className="min-h-dvh pb-10" style={{ background: "var(--bg)" }}>
      {/* Back */}
      <div className="flex items-center px-6 pt-10 pb-2">
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ←
        </button>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-6 mt-2"
      >
        {/* Avatar + name */}
        <div className="flex items-start gap-5">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0"
            style={{ background: "var(--surface-2)" }}
          >
            {avatarEmojis[mother.id] || "👩"}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="bn text-2xl font-semibold" style={{ color: "var(--text)" }}>
              {mother.name}
            </h1>
            <p className="bn text-sm mt-1" style={{ color: "var(--muted)" }}>
              {mother.age} বছর · {mother.zilla}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {mother.verified && (
                <span className="bn text-white rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--green)" }}>
                  ✓ যাচাই করা
                </span>
              )}
              <span
                className="bn rounded-full px-2 py-0.5 text-xs"
                style={{ background: "var(--surface-2)", color: motivationMeta.color }}
              >
                {motivationMeta.emoji} {motivationMeta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 px-5 py-4 rounded-2xl"
          style={{ background: "var(--terra)" }}
        >
          <p className="bn text-white text-lg font-medium leading-snug">
            "{mother.philosophy}"
          </p>
          <p className="text-white/60 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {mother.philosophyEn}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 rounded-2xl p-5"
          style={{ background: "var(--surface)" }}
        >
          <h3 className="bn font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
            পরিচয়
          </h3>
          <p className="bn text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {mother.story}
          </p>
        </motion.div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 rounded-2xl p-5"
          style={{ background: "var(--surface)" }}
        >
          <h3 className="bn font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
            বিশেষত্ব
          </h3>
          <div className="flex flex-wrap gap-2">
            {mother.specialties.map((s) => (
              <span
                key={s}
                className="bn text-sm px-3 py-1.5 rounded-full"
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              >
                🍳 {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Recipes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <h3 className="bn font-semibold text-base mb-4" style={{ color: "var(--text)" }}>
            রেসিপি ({recipes.length}টি)
          </h3>
          <div className="flex flex-col gap-3">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
              >
                <Link href={`/recipe/${recipe.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    className="rounded-2xl p-4"
                    style={{ background: "var(--surface)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="bn font-semibold text-base" style={{ color: "var(--text)" }}>
                          {recipe.name}
                        </h4>
                        <p className="text-sm mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
                          {recipe.nameEn}
                        </p>
                        <p
                          className="bn text-xs mt-2 italic"
                          style={{ color: "var(--terra)" }}
                        >
                          "{recipe.layers.motherVoice.note}"
                        </p>
                      </div>
                      <span className="text-2xl ml-4">🍳</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⏱️</span>
                        <span className="bn text-xs" style={{ color: "var(--muted)" }}>
                          {recipe.timeMinutes} মিনিট
                        </span>
                      </div>
                      <div className="flex gap-0.5 items-center">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div
                            key={j}
                            className="diff-dot"
                            style={{ background: j < recipe.difficulty ? "var(--gold)" : "var(--border)" }}
                          />
                        ))}
                        <span className="bn text-xs ml-1" style={{ color: "var(--muted)" }}>
                          {DIFFICULTY_LABELS[recipe.difficulty]}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bn text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--surface-2)", color: "var(--muted)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
