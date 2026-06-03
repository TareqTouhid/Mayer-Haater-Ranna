"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import recipesData from "@/data/recipes.json";
import mothersData from "@/data/mothers.json";
import type { Recipe, Mother } from "@/lib/types";

type Layer = "motherVoice" | "kitchenReality" | "aiBridge";
type Mode = "overview" | "cooking";

const LAYER_CONFIG = [
  { key: "motherVoice" as Layer, label: "মায়ের কথায়", emoji: "💬" },
  { key: "kitchenReality" as Layer, label: "রান্নার নির্দেশ", emoji: "📋" },
  { key: "aiBridge" as Layer, label: "বুঝতে সাহায্য", emoji: "💡" },
];

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

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState<Layer>("motherVoice");
  const [mode, setMode] = useState<Mode>("overview");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const recipe = (recipesData as Recipe[]).find((r) => r.id === id);
  const mother = recipe ? (mothersData as Mother[]).find((m) => m.id === recipe.motherId) : null;

  if (!recipe || !mother) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="bn text-lg" style={{ color: "var(--muted)" }}>রেসিপি পাওয়া যায়নি</p>
      </div>
    );
  }

  const steps = recipe.layers.kitchenReality.steps;
  const totalTime = steps.reduce((sum, s) => sum + s.timeMinutes, 0);

  function toggleStep(idx: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    if (idx === currentStep && idx < steps.length - 1) {
      setTimeout(() => setCurrentStep(idx + 1), 300);
    }
  }

  if (mode === "cooking") {
    return <CookingMode
      recipe={recipe}
      mother={mother}
      currentStep={currentStep}
      completedSteps={completedSteps}
      onToggleStep={toggleStep}
      onStepChange={setCurrentStep}
      onDone={() => router.push(`/review/${recipe.id}`)}
      onExit={() => setMode("overview")}
    />;
  }

  return (
    <div className="min-h-dvh pb-36" style={{ background: "var(--bg)" }}>
      {/* Back + mother link */}
      <div className="flex items-center justify-between px-6 pt-10 pb-2">
        <button
          onClick={() => router.back()}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ←
        </button>
        <Link href={`/mother/${mother.id}`}>
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <span className="text-lg">{avatarEmojis[mother.id] || "👩"}</span>
            <span className="bn text-sm font-medium" style={{ color: "var(--text)" }}>
              {mother.name}
            </span>
          </div>
        </Link>
      </div>

      {/* Recipe title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="px-6 mt-3"
      >
        <h1 className="bn text-2xl font-semibold" style={{ color: "var(--text)" }}>
          {recipe.name}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
          {recipe.nameEn} · {recipe.servings} জন
        </p>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="bn text-sm" style={{ color: "var(--muted)" }}>⏱️ ~{recipe.timeMinutes} মিনিট</span>
          <div className="flex gap-0.5 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="diff-dot" style={{ background: i < recipe.difficulty ? "var(--gold)" : "var(--border)" }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Layer tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="px-6 mt-5"
      >
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: "var(--surface)" }}
        >
          {LAYER_CONFIG.map((lc) => (
            <button
              key={lc.key}
              onClick={() => setActiveLayer(lc.key)}
              className="flex-1 py-2.5 rounded-xl text-center transition-all duration-200"
              style={{
                background: activeLayer === lc.key ? "var(--gold)" : "transparent",
                color: activeLayer === lc.key ? "white" : "var(--muted)",
              }}
            >
              <span className="text-sm">{lc.emoji}</span>
              <p className="bn text-xs mt-0.5 font-medium">{lc.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Layer content */}
      <div className="px-6 mt-4">
        <AnimatePresence mode="wait">
          {activeLayer === "motherVoice" && (
            <motion.div
              key="motherVoice"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{avatarEmojis[mother.id] || "👩"}</span>
                  <div>
                    <p className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>{mother.name}</p>
                    <p className="bn text-xs" style={{ color: "var(--muted)" }}>{mother.zilla} থেকে</p>
                  </div>
                </div>
                <p className="mother-voice text-base leading-loose">
                  {recipe.layers.motherVoice.text}
                </p>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="bn text-sm font-semibold italic" style={{ color: "var(--gold)" }}>
                    💛 "{recipe.layers.motherVoice.note}"
                  </p>
                </div>
              </div>

              {/* Ingredients list under mother voice */}
              <div className="mt-4 rounded-2xl p-5" style={{ background: "var(--surface)" }}>
                <h3 className="bn font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
                  উপকরণ ({recipe.ingredients.length}টি)
                </h3>
                <div className="flex flex-col gap-2">
                  {recipe.ingredients.map((ing) => (
                    <div key={ing.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background:
                              ing.importance === "must"
                                ? "var(--terra)"
                                : ing.importance === "medium"
                                ? "var(--gold)"
                                : "var(--border)",
                          }}
                        />
                        <span className="bn text-sm" style={{ color: "var(--text)" }}>
                          {ing.name}
                        </span>
                        {ing.importance === "optional" && (
                          <span className="bn text-xs" style={{ color: "var(--muted)" }}>(ঐচ্ছিক)</span>
                        )}
                      </div>
                      <span className="bn text-sm" style={{ color: "var(--muted)" }}>
                        {ing.amount} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  {[
                    { color: "var(--terra)", label: "অবশ্যই লাগবে" },
                    { color: "var(--gold)", label: "ভালো হয়" },
                    { color: "var(--border)", label: "ঐচ্ছিক" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="bn text-xs" style={{ color: "var(--muted)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeLayer === "kitchenReality" && (
            <motion.div
              key="kitchenReality"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
                {steps.map((step, i) => (
                  <div
                    key={step.step}
                    className="p-5"
                    style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none" }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "var(--gold)", color: "white" }}
                      >
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="bn text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                          {step.instruction}
                        </p>
                        {step.timeMinutes > 0 && (
                          <p className="bn text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                            ⏱️ ~{step.timeMinutes} মিনিট
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeLayer === "aiBridge" && (
            <motion.div
              key="aiBridge"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl p-5" style={{ background: "var(--surface)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">💡</span>
                  <p className="bn text-sm font-semibold" style={{ color: "var(--text)" }}>
                    কী বলতে চাইছেন তিনি
                  </p>
                </div>
                <p className="bn text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {recipe.layers.aiBridge.text}
                </p>
              </div>

              {recipe.layers.aiBridge.tips.length > 0 && (
                <div className="mt-3 rounded-2xl p-5" style={{ background: "var(--surface)" }}>
                  <h4 className="bn font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>
                    কাজের টিপস
                  </h4>
                  <div className="flex flex-col gap-2">
                    {recipe.layers.aiBridge.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0 mt-0.5">✓</span>
                        <p className="bn text-sm" style={{ color: "var(--muted)" }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Start cooking CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setMode("cooking"); setCurrentStep(0); setCompletedSteps(new Set()); }}
          className="w-full py-4 rounded-2xl font-semibold text-center text-base bn"
          style={{ background: "var(--gold)", color: "white", boxShadow: "0 4px 24px rgba(212,146,10,0.35)" }}
        >
          🍳 ধাপে ধাপে রান্না শুরু করি
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Step-by-step Cooking Mode ─── */
function CookingMode({
  recipe,
  mother,
  currentStep,
  completedSteps,
  onToggleStep,
  onStepChange,
  onDone,
  onExit,
}: {
  recipe: Recipe;
  mother: Mother;
  currentStep: number;
  completedSteps: Set<number>;
  onToggleStep: (i: number) => void;
  onStepChange: (i: number) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const steps = recipe.layers.kitchenReality.steps;
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((completedSteps.size) / steps.length) * 100;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div className="px-6 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={onExit}
          className="touch-target flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ✕
        </button>
        <div className="flex-1">
          <p className="bn font-semibold text-sm" style={{ color: "var(--text)" }}>{recipe.name}</p>
          <p className="bn text-xs" style={{ color: "var(--muted)" }}>
            ধাপ {currentStep + 1} / {steps.length}
          </p>
        </div>
        <span className="bn text-sm font-medium" style={{ color: "var(--gold)" }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mx-6 rounded-full overflow-hidden h-1.5" style={{ background: "var(--surface-2)" }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: "var(--gold)" }}
        />
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col px-6 mt-6"
        >
          {/* Step number badge */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: "var(--gold)", color: "white" }}
            >
              {step.step}
            </div>
            <div>
              <p className="bn text-xs" style={{ color: "var(--muted)" }}>বর্তমান ধাপ</p>
              {step.timeMinutes > 0 && (
                <p className="bn text-sm font-medium" style={{ color: "var(--terra)" }}>
                  ⏱️ ~{step.timeMinutes} মিনিট
                </p>
              )}
            </div>
          </div>

          {/* Instruction */}
          <div
            className="rounded-2xl p-6 flex-1 flex items-center"
            style={{ background: "var(--surface)", minHeight: 180 }}
          >
            <p className="bn text-xl leading-loose font-medium" style={{ color: "var(--text)" }}>
              {step.instruction}
            </p>
          </div>

          {/* Mother reminder */}
          {currentStep === steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-4 rounded-xl"
              style={{ background: "var(--surface-2)" }}
            >
              <p className="bn text-sm italic" style={{ color: "var(--terra)" }}>
                💛 "{recipe.layers.motherVoice.note}"
              </p>
              <p className="bn text-xs mt-1" style={{ color: "var(--muted)" }}>— {mother.name}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step dots */}
      <div className="px-6 py-4 flex justify-center gap-2 flex-wrap">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => onStepChange(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-200"
            style={{
              background: completedSteps.has(i)
                ? "var(--green)"
                : i === currentStep
                ? "var(--gold)"
                : "var(--border)",
              transform: i === currentStep ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 flex gap-3">
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="touch-target flex-1 py-4 rounded-2xl bn font-medium text-center"
          style={{
            background: "var(--surface)",
            color: currentStep === 0 ? "var(--border)" : "var(--text)",
          }}
        >
          ← আগে
        </button>

        {isLast ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onDone}
            className="touch-target flex-[2] py-4 rounded-2xl bn font-semibold text-center"
            style={{ background: "var(--green)", color: "white" }}
          >
            রান্না শেষ! রেটিং দাও ⭐
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onToggleStep(currentStep);
            }}
            className="touch-target flex-[2] py-4 rounded-2xl bn font-semibold text-center"
            style={{ background: "var(--gold)", color: "white" }}
          >
            {completedSteps.has(currentStep) ? "পরের ধাপ →" : "হয়ে গেছে ✓"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
