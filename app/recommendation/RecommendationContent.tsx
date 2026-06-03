"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { findBestMatch, findAlternatives } from "@/lib/matcher";
import type { MatchResult, UserPreferences } from "@/lib/types";
import mothersData from "@/data/mothers.json";
import recipesData from "@/data/recipes.json";

export default function RecommendationContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<MatchResult | null>(null);
  const [alternatives, setAlternatives] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlts, setShowAlts] = useState(false);

  const prefs: UserPreferences = {
    ingredients: (params.get("ingredients") || "").split(",").filter(Boolean),
    spice: (params.get("spice") as UserPreferences["spice"]) || "medium",
    mealWeight: (params.get("weight") as UserPreferences["mealWeight"]) || "any",
    rice: (params.get("rice") as UserPreferences["rice"]) || "any",
    timeAvailable: params.get("time") ? Number(params.get("time")) : null,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = findBestMatch(recipesData as any, mothersData as any, prefs);
      setResult(match);
      if (match) {
        const alts = findAlternatives(recipesData as any, mothersData as any, prefs, match.recipe.id);
        setAlternatives(alts);
      }
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
        <motion.p
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="bn text-2xl"
          style={{ color: "var(--muted)" }}
        >
          খুঁজছি...
        </motion.p>
        <p className="bn text-sm mt-3" style={{ color: "var(--muted)", opacity: 0.6 }}>
          কোনো মায়ের রেসিপি মিলিয়ে দেখছি
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center" style={{ background: "var(--bg)" }}>
        <span className="text-5xl mb-4">😔</span>
        <h2 className="bn text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>
          মিললো না
        </h2>
        <p className="bn text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
          এই উপকরণ দিয়ে এখন কোনো রেসিপি খুঁজে পাওয়া যায়নি। একটু বেশি উপকরণ যোগ করো।
        </p>
        <button
          onClick={() => router.back()}
          className="bn py-3 px-6 rounded-xl font-medium"
          style={{ background: "var(--gold)", color: "white" }}
        >
          আবার চেষ্টা করো
        </button>
      </div>
    );
  }

  const { recipe, mother, matchPercent, missingMust, missingMedium, excellenceTips, coveredIngredients } = result;
  const totalIngredients = recipe.ingredients.length;
  const coveredCount = coveredIngredients.length;

  return (
    <div className="min-h-dvh pb-40" style={{ background: "var(--bg)" }}>
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center px-6 pt-10 pb-2"
      >
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ←
        </button>
        <p className="bn text-sm ml-3" style={{ color: "var(--muted)" }}>
          তোমার জন্য রেসিপি
        </p>
      </motion.div>

      {/* Match card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-6 mt-3 rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
      >
        {/* Mother strip */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: "var(--surface-2)" }}
          >
            👩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bn font-semibold text-base" style={{ color: "var(--text)" }}>
                {mother.name}
              </span>
              {mother.verified && (
                <span className="bn text-white rounded-full px-1.5 py-0.5" style={{ background: "var(--green)", fontSize: "0.6rem" }}>
                  ✓ যাচাই
                </span>
              )}
            </div>
            <p className="bn text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {mother.age} বছর · {mother.zilla}
            </p>
            <p className="bn text-xs mt-1 italic" style={{ color: "var(--terra)" }}>
              "{mother.philosophy}"
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Dish */}
        <div className="px-5 py-5">
          <h2 className="bn text-2xl font-semibold" style={{ color: "var(--text)" }}>
            {recipe.name}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
            {recipe.nameEn}
          </p>

          {/* Mother's note */}
          <p
            className="bn text-sm mt-3 leading-relaxed px-4 py-3 rounded-xl italic"
            style={{ background: "var(--surface-2)", color: "var(--terra)" }}
          >
            "{recipe.layers.motherVoice.note}"
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⏱️</span>
              <span className="bn text-sm" style={{ color: "var(--muted)" }}>
                ~{recipe.timeMinutes} মিনিট
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">📊</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="diff-dot"
                    style={{ background: i < recipe.difficulty ? "var(--gold)" : "var(--border)" }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👥</span>
              <span className="bn text-sm" style={{ color: "var(--muted)" }}>
                {recipe.servings} জন
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* Ingredient match */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="bn text-sm font-medium" style={{ color: "var(--text)" }}>
              উপকরণ মিল
            </p>
            <span
              className="bn text-sm font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: matchPercent >= 70 ? "var(--green)" : matchPercent >= 40 ? "var(--gold)" : "var(--terra)",
                color: "white",
              }}
            >
              {matchPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="rounded-full overflow-hidden h-2 mb-3" style={{ background: "var(--surface-2)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchPercent}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: matchPercent >= 70 ? "var(--green)" : matchPercent >= 40 ? "var(--gold)" : "var(--terra)",
              }}
            />
          </div>

          <p className="bn text-sm" style={{ color: "var(--muted)" }}>
            তোমার {coveredCount}টি উপকরণ আছে (মোট {totalIngredients}টি লাগে)
          </p>

          {/* Missing must */}
          {missingMust.length > 0 && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: "#FEF3C7" }}>
              <p className="bn text-xs font-semibold mb-1" style={{ color: "#92400E" }}>
                ⚠️ এগুলো লাগবেই:
              </p>
              <p className="bn text-xs" style={{ color: "#78350F" }}>
                {missingMust.join(", ")}
              </p>
            </div>
          )}

          {/* Excellence tips */}
          {excellenceTips.length > 0 && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
              <p className="bn text-xs font-semibold mb-1" style={{ color: "var(--green)" }}>
                ✨ আরও ভালো হতো যদি:
              </p>
              {excellenceTips.slice(0, 2).map((tip, i) => (
                <p key={i} className="bn text-xs mt-1" style={{ color: "var(--muted)" }}>
                  · {tip}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="bn text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Alternatives toggle */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mx-6 mt-4"
        >
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="bn w-full py-3 rounded-xl text-sm"
            style={{ background: "var(--surface-2)", color: "var(--muted)" }}
          >
            {showAlts ? "লুকাও" : `অন্য বিকল্প দেখাও (${alternatives.length}টি) →`}
          </button>

          <AnimatePresence>
            {showAlts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 mt-3">
                  {alternatives.map((alt) => (
                    <Link key={alt.recipe.id} href={`/recipe/${alt.recipe.id}?from=recommendation`}>
                      <motion.div
                        whileTap={{ scale: 0.99 }}
                        className="rounded-xl p-4 flex items-center gap-3"
                        style={{ background: "var(--surface)" }}
                      >
                        <div>
                          <p className="bn font-medium text-sm" style={{ color: "var(--text)" }}>
                            {alt.recipe.name}
                          </p>
                          <p className="bn text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            {alt.mother.name} · {alt.matchPercent}% মিল
                          </p>
                        </div>
                        <span className="ml-auto text-sm" style={{ color: "var(--muted)" }}>→</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Bottom CTAs */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50 flex flex-col gap-3">
        <Link href={`/recipe/${recipe.id}`}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.6 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-semibold text-center text-base bn"
            style={{
              background: "var(--gold)",
              color: "white",
              boxShadow: "0 4px 24px rgba(212,146,10,0.35)",
            }}
          >
            রান্না শুরু করি →
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
