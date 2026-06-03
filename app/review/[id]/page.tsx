"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import recipesData from "@/data/recipes.json";
import mothersData from "@/data/mothers.json";
import type { Recipe, Mother } from "@/lib/types";

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

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const recipe = (recipesData as Recipe[]).find((r) => r.id === id);
  const mother = recipe ? (mothersData as Mother[]).find((m) => m.id === recipe.motherId) : null;

  const [recipeRating, setRecipeRating] = useState(0);
  const [motherRating, setMotherRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!recipe || !mother) return null;

  function handleSubmit() {
    if (recipeRating === 0 || motherRating === 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="text-6xl block mb-4">🙏</span>
          <h2 className="bn text-2xl font-semibold mb-3" style={{ color: "var(--text)" }}>
            ধন্যবাদ!
          </h2>
          <p className="bn text-base leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
            তুমি {mother.name}-এর রেসিপি রান্না করেছো।
          </p>
          <p className="bn text-sm" style={{ color: "var(--muted)" }}>
            তোমার মতামত {mother.name} পর্যন্ত পৌঁছাবে।
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-5 rounded-2xl text-left"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{avatarEmojis[mother.id] || "👩"}</span>
              <div>
                <p className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>{mother.name}</p>
                <p className="bn text-xs italic" style={{ color: "var(--terra)" }}>
                  "{mother.philosophy}"
                </p>
              </div>
            </div>
            <p className="bn text-sm" style={{ color: "var(--muted)" }}>
              তোমার রেটিং: {Array.from({ length: motherRating }).map(() => "⭐").join("")}
            </p>
          </motion.div>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-semibold text-center text-base bn"
                style={{ background: "var(--gold)", color: "white" }}
              >
                হোমে ফিরে যাও
              </motion.div>
            </Link>
            <Link href="/cook">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-medium text-center text-base bn"
                style={{ background: "var(--surface)", color: "var(--text)" }}
              >
                আবার রান্না করি
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-36" style={{ background: "var(--bg)" }}>
      <div className="flex items-center px-6 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ←
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="px-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🍳</span>
          <h1 className="bn text-2xl font-semibold" style={{ color: "var(--text)" }}>
            রান্না কেমন হলো?
          </h1>
          <p className="bn text-sm mt-1" style={{ color: "var(--muted)" }}>
            {recipe.name} — {mother.name}-এর রেসিপি
          </p>
        </div>

        {/* Recipe rating */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--surface)" }}>
          <h3 className="bn font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>
            রেসিপির মান
          </h3>
          <p className="bn text-xs mb-4" style={{ color: "var(--muted)" }}>
            রেসিপিটা কতটা কাজে এলো?
          </p>
          <StarRating value={recipeRating} onChange={setRecipeRating} />
          <div className="flex justify-between mt-2">
            {["একদমই না", "মোটামুটি", "ভালো", "খুব ভালো", "চমৎকার"].map((label, i) => (
              <span key={i} className="bn text-xs" style={{ color: i + 1 === recipeRating ? "var(--gold)" : "transparent" }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Mother rating */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--surface)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{avatarEmojis[mother.id] || "👩"}</span>
            <div>
              <h3 className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>
                {mother.name}-কে রেটিং দাও
              </h3>
              <p className="bn text-xs italic" style={{ color: "var(--terra)" }}>
                "{mother.philosophy}"
              </p>
            </div>
          </div>
          <p className="bn text-xs mb-4" style={{ color: "var(--muted)" }}>
            তার রান্নার পদ্ধতি কেমন লাগলো?
          </p>
          <StarRating value={motherRating} onChange={setMotherRating} />
        </div>

        {/* Comment */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--surface)" }}>
          <h3 className="bn font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
            কিছু বলতে চাও? (ঐচ্ছিক)
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="রান্না কেমন হলো, কোনো পরিবর্তন করলে, বা যা মনে চায় লিখো..."
            rows={4}
            className="bn w-full rounded-xl p-3 text-sm resize-none"
            style={{
              background: "var(--surface-2)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontFamily: "'Hind Siliguri', sans-serif",
              outline: "none",
            }}
          />
        </div>
      </motion.div>

      {/* Submit */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <motion.button
          whileTap={{ scale: recipeRating > 0 && motherRating > 0 ? 0.97 : 1 }}
          onClick={handleSubmit}
          disabled={recipeRating === 0 || motherRating === 0}
          className="w-full py-4 rounded-2xl font-semibold text-center text-base bn"
          style={{
            background: recipeRating > 0 && motherRating > 0 ? "var(--gold)" : "var(--border)",
            color: recipeRating > 0 && motherRating > 0 ? "white" : "var(--muted)",
            transition: "all 0.3s ease",
            boxShadow: recipeRating > 0 && motherRating > 0 ? "0 4px 24px rgba(212,146,10,0.35)" : "none",
          }}
        >
          {recipeRating > 0 && motherRating > 0 ? "রেটিং জমা দাও 🙏" : "রেটিং দাও আগে"}
        </motion.button>
      </div>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileTap={{ scale: 0.85 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="touch-target text-3xl"
          style={{ opacity: star <= (hovered || value) ? 1 : 0.25, transition: "opacity 0.15s" }}
        >
          ⭐
        </motion.button>
      ))}
    </div>
  );
}
