"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SPICE_OPTIONS = [
  { value: "mild", label: "হালকা", emoji: "🌿" },
  { value: "medium", label: "মাঝারি", emoji: "🌶️" },
  { value: "high", label: "ঝাল", emoji: "🔥" },
];

const WEIGHT_OPTIONS = [
  { value: "light", label: "হালকা খাবার", emoji: "🥗" },
  { value: "any", label: "যেকোনো", emoji: "🍽️" },
  { value: "heavy", label: "ভারী খাবার", emoji: "🍲" },
];

const RICE_OPTIONS = [
  { value: "yes", label: "ভাতের সাথে", emoji: "🍚" },
  { value: "any", label: "যেকোনো", emoji: "✨" },
  { value: "no", label: "ভাত ছাড়া", emoji: "🫓" },
];

const TIME_OPTIONS = [
  { value: 15, label: "১৫ মিনিট" },
  { value: 30, label: "৩০ মিনিট" },
  { value: 60, label: "১ ঘণ্টা" },
  { value: null, label: "সময় নেই" },
];

const QUICK_INGREDIENTS = [
  "আলু", "পেঁয়াজ", "রসুন", "টমেটো", "মুরগি",
  "ডিম", "মাছ", "ডাল", "বেগুন", "চিংড়ি",
];

export default function CookPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [spice, setSpice] = useState("medium");
  const [weight, setWeight] = useState("any");
  const [rice, setRice] = useState("any");
  const [time, setTime] = useState<number | null>(null);

  function addIngredient(val: string) {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      setIngredients((prev) => prev.slice(0, -1));
    }
  }

  function removeIngredient(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleFind() {
    if (ingredients.length === 0) return;
    const params = new URLSearchParams({
      ingredients: ingredients.join(","),
      spice,
      weight,
      rice,
      ...(time ? { time: String(time) } : {}),
    });
    router.push(`/recommendation?${params.toString()}`);
  }

  return (
    <div className="min-h-dvh pb-32" style={{ background: "var(--bg)" }}>
      {/* Back + header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-6 pt-10 pb-4"
      >
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
          aria-label="back"
        >
          ←
        </button>
        <div>
          <h1 className="bn text-xl font-semibold" style={{ color: "var(--text)" }}>
            কী রান্না করবো?
          </h1>
          <p className="bn text-xs" style={{ color: "var(--muted)" }}>
            তোমার কাছে কী কী আছে বলো
          </p>
        </div>
      </motion.div>

      {/* Ingredient input */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mx-6 mt-2"
      >
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
            <AnimatePresence>
              {ingredients.map((ing, i) => (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ background: "var(--gold)", color: "white" }}
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(i)}
                    className="opacity-70 hover:opacity-100 leading-none"
                    aria-label={`remove ${ing}`}
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (inputValue.trim()) addIngredient(inputValue); }}
            placeholder="কী কী আছে তোমার কাছে? লিখো..."
            className="bn w-full bg-transparent text-base py-1 placeholder:text-sm"
            style={{
              color: "var(--text)",
              outline: "none",
              fontFamily: "'Hind Siliguri', sans-serif",
            }}
          />
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            Enter বা কমা (,) চেপে যোগ করো
          </p>
        </div>

        {/* Quick add */}
        <div className="mt-3">
          <p className="bn text-xs mb-2" style={{ color: "var(--muted)" }}>
            দ্রুত যোগ করো:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_INGREDIENTS.filter((q) => !ingredients.includes(q)).map((q) => (
              <motion.button
                key={q}
                whileTap={{ scale: 0.95 }}
                onClick={() => addIngredient(q)}
                className="bn text-sm px-3 py-1.5 rounded-full"
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              >
                + {q}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Preferences */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="mx-6 mt-6"
      >
        <PrefSection label="মশলার পরিমাণ">
          <div className="grid grid-cols-3 gap-2">
            {SPICE_OPTIONS.map((opt) => (
              <PrefButton
                key={opt.value}
                active={spice === opt.value}
                onClick={() => setSpice(opt.value)}
                emoji={opt.emoji}
                label={opt.label}
              />
            ))}
          </div>
        </PrefSection>

        <PrefSection label="খাবারের ধরন" className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {WEIGHT_OPTIONS.map((opt) => (
              <PrefButton
                key={opt.value}
                active={weight === opt.value}
                onClick={() => setWeight(opt.value)}
                emoji={opt.emoji}
                label={opt.label}
              />
            ))}
          </div>
        </PrefSection>

        <PrefSection label="ভাত?" className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {RICE_OPTIONS.map((opt) => (
              <PrefButton
                key={opt.value}
                active={rice === opt.value}
                onClick={() => setRice(opt.value)}
                emoji={opt.emoji}
                label={opt.label}
              />
            ))}
          </div>
        </PrefSection>

        <PrefSection label="সময় কতটুকু আছে?" className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map((opt) => (
              <motion.button
                key={String(opt.value)}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTime(opt.value)}
                className="bn py-2.5 rounded-xl text-sm font-medium text-center"
                style={{
                  background: time === opt.value ? "var(--gold)" : "var(--surface-2)",
                  color: time === opt.value ? "white" : "var(--text)",
                  transition: "all 0.2s ease",
                }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </PrefSection>
      </motion.section>

      {/* Find button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <motion.button
          whileTap={{ scale: ingredients.length > 0 ? 0.97 : 1 }}
          onClick={handleFind}
          disabled={ingredients.length === 0}
          className="w-full py-4 rounded-2xl font-semibold text-base bn"
          style={{
            background: ingredients.length > 0 ? "var(--gold)" : "var(--border)",
            color: ingredients.length > 0 ? "white" : "var(--muted)",
            boxShadow: ingredients.length > 0 ? "0 4px 24px rgba(212,146,10,0.35)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {ingredients.length === 0
            ? "আগে কিছু উপকরণ যোগ করো"
            : `রেসিপি খুঁজে দাও →`}
        </motion.button>
      </div>
    </div>
  );
}

function PrefSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="bn text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function PrefButton({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bn py-3 rounded-xl text-center flex flex-col items-center gap-1"
      style={{
        background: active ? "var(--gold)" : "var(--surface-2)",
        color: active ? "white" : "var(--text)",
        transition: "all 0.2s ease",
      }}
    >
      <span className="text-lg">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}
