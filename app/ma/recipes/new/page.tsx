"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { store, PendingRecipe } from "@/lib/store";

type Importance = "must" | "medium" | "optional";

interface IngredientRow {
  id: string;
  name: string;
  amount: string;
  importance: Importance;
}

interface StepRow {
  id: string;
  instruction: string;
  timeMinutes: number;
}

const IMPORTANCE_CONFIG: Record<Importance, { label: string; color: string; bg: string }> = {
  must: { label: "অবশ্যই", color: "white", bg: "var(--terra)" },
  medium: { label: "ভালো হয়", color: "white", bg: "var(--gold)" },
  optional: { label: "ঐচ্ছিক", color: "var(--text)", bg: "var(--surface-2)" },
};

export default function NewRecipePage() {
  const router = useRouter();
  const [step, setStep] = useState<"basics" | "ingredients" | "steps" | "voice" | "preview">("basics");

  // Basics
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState(2);
  const [servings, setServings] = useState(4);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Ingredients
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: "1", name: "", amount: "", importance: "must" },
  ]);

  // Steps
  const [steps, setSteps] = useState<StepRow[]>([
    { id: "1", instruction: "", timeMinutes: 5 },
  ]);

  // Voice layer
  const [motherVoice, setMotherVoice] = useState("");
  const [motherNote, setMotherNote] = useState("");

  const STEPS_ORDER = ["basics", "ingredients", "steps", "voice", "preview"] as const;
  const currentIdx = STEPS_ORDER.indexOf(step);

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function addIngredient() {
    setIngredients([...ingredients, { id: Date.now().toString(), name: "", amount: "", importance: "must" }]);
  }

  function updateIngredient(id: string, field: keyof IngredientRow, value: string) {
    setIngredients(ingredients.map((ing) => ing.id === id ? { ...ing, [field]: value } : ing));
  }

  function removeIngredient(id: string) {
    if (ingredients.length > 1) setIngredients(ingredients.filter((i) => i.id !== id));
  }

  function cycleImportance(id: string) {
    const order: Importance[] = ["must", "medium", "optional"];
    setIngredients(ingredients.map((ing) => {
      if (ing.id !== id) return ing;
      const next = order[(order.indexOf(ing.importance) + 1) % order.length];
      return { ...ing, importance: next };
    }));
  }

  function addStep() {
    setSteps([...steps, { id: Date.now().toString(), instruction: "", timeMinutes: 5 }]);
  }

  function updateStep(id: string, field: keyof StepRow, value: string | number) {
    setSteps(steps.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function removeStep(id: string) {
    if (steps.length > 1) setSteps(steps.filter((s) => s.id !== id));
  }

  function handleSubmit() {
    const motherId = store.getCurrentMotherId();
    const allMothers = store.getPendingMothers();
    const mother = motherId ? allMothers.find((m) => m.id === motherId) : allMothers[0];

    const recipe: PendingRecipe = {
      id: `pr-${Date.now()}`,
      motherId: mother?.id || "unknown",
      motherName: mother?.name || "অজানা",
      name,
      nameEn,
      difficulty,
      timeMinutes,
      servings,
      tags,
      ingredients: ingredients.filter((i) => i.name.trim()).map((i) => ({
        name: i.name,
        nameEn: i.name,
        amount: i.amount,
        unit: "",
        importance: i.importance,
      })),
      motherVoiceText: motherVoice,
      motherVoiceNote: motherNote,
      steps: steps.filter((s) => s.instruction.trim()).map((s) => ({
        instruction: s.instruction,
        timeMinutes: s.timeMinutes,
      })),
      aiBridgeText: "",
      tips: [],
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    store.savePendingRecipe(recipe);
    router.push("/ma?submitted=1");
  }

  return (
    <div className="min-h-dvh pb-36" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-10 pb-4">
        <button
          onClick={() => currentIdx > 0 ? setStep(STEPS_ORDER[currentIdx - 1]) : router.back()}
          className="touch-target w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: "var(--surface)" }}
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="bn font-semibold text-base" style={{ color: "var(--text)" }}>নতুন রেসিপি</h1>
          <p className="bn text-xs" style={{ color: "var(--muted)" }}>
            ধাপ {currentIdx + 1} / {STEPS_ORDER.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mx-6 rounded-full overflow-hidden h-1.5" style={{ background: "var(--surface-2)" }}>
        <motion.div
          animate={{ width: `${((currentIdx + 1) / STEPS_ORDER.length) * 100}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: "var(--gold)" }}
        />
      </div>

      <div className="px-6 mt-5">
        <AnimatePresence mode="wait">

          {/* ── BASICS ── */}
          {step === "basics" && (
            <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="bn text-xl font-semibold mb-5" style={{ color: "var(--text)" }}>রেসিপির তথ্য</h2>

              <Field label="রান্নার নাম (বাংলায়)">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: লাউ চিংড়ি" className="bn input-field" style={inputStyle} />
              </Field>
              <Field label="ইংরেজিতে নাম (ঐচ্ছিক)" className="mt-4">
                <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Bottle Gourd with Shrimp" className="input-field" style={{ ...inputStyle, fontFamily: "'DM Sans'" }} />
              </Field>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <Field label="সময় (মিনিট)">
                  <input type="number" value={timeMinutes} onChange={(e) => setTimeMinutes(Number(e.target.value))} className="input-field bn text-center" style={inputStyle} />
                </Field>
                <Field label="কত জনের জন্য">
                  <input type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} className="input-field bn text-center" style={inputStyle} />
                </Field>
                <Field label="কঠিনত্ব">
                  <div className="flex items-center justify-center gap-1 rounded-xl px-2 py-3" style={{ background: "var(--surface-2)" }}>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button key={d} onClick={() => setDifficulty(d)}>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d <= difficulty ? "var(--gold)" : "var(--border)" }} />
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <Field label="ট্যাগ" className="mt-4">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((t) => (
                    <span key={t} className="bn text-sm px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "var(--gold)", color: "white" }}>
                      {t}
                      <button onClick={() => setTags(tags.filter((x) => x !== t))} className="opacity-70">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="যেমন: মাছ, ভাতের সাথে" className="bn flex-1 rounded-xl px-3 py-2.5 text-sm" style={inputStyle} />
                  <button onClick={addTag} className="px-4 rounded-xl bn text-sm" style={{ background: "var(--gold)", color: "white" }}>যোগ</button>
                </div>
              </Field>
            </motion.div>
          )}

          {/* ── INGREDIENTS ── */}
          {step === "ingredients" && (
            <motion.div key="ingredients" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="bn text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>উপকরণ</h2>
              <p className="bn text-sm mb-5" style={{ color: "var(--muted)" }}>
                প্রতিটি উপকরণের পাশে গুরুত্ব বোতামে চাপো।
              </p>

              <div className="flex flex-col gap-3">
                {ingredients.map((ing, i) => (
                  <motion.div key={ing.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="rounded-2xl p-4" style={{ background: "var(--surface)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bn text-xs font-medium" style={{ color: "var(--muted)" }}>{i + 1}.</span>
                      <button
                        onClick={() => cycleImportance(ing.id)}
                        className="bn text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: IMPORTANCE_CONFIG[ing.importance].bg, color: IMPORTANCE_CONFIG[ing.importance].color }}
                      >
                        {IMPORTANCE_CONFIG[ing.importance].label}
                      </button>
                      <button onClick={() => removeIngredient(ing.id)} className="ml-auto text-sm" style={{ color: "var(--muted)" }}>×</button>
                    </div>
                    <div className="flex gap-2">
                      <input value={ing.name} onChange={(e) => updateIngredient(ing.id, "name", e.target.value)} placeholder="উপকরণের নাম" className="bn flex-[2] rounded-xl px-3 py-2.5 text-sm" style={inputStyle} />
                      <input value={ing.amount} onChange={(e) => updateIngredient(ing.id, "amount", e.target.value)} placeholder="পরিমাণ" className="bn flex-1 rounded-xl px-3 py-2.5 text-sm" style={inputStyle} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={addIngredient} className="bn w-full mt-3 py-3 rounded-xl text-sm font-medium"
                style={{ background: "var(--surface-2)", color: "var(--gold)", border: "1.5px dashed var(--gold)" }}>
                + আরেকটি উপকরণ যোগ করো
              </button>

              <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface)" }}>
                <p className="bn text-xs font-semibold mb-2" style={{ color: "var(--text)" }}>গুরুত্বের মাত্রা:</p>
                {(["must", "medium", "optional"] as Importance[]).map((imp) => (
                  <div key={imp} className="flex items-center gap-2 mt-1.5">
                    <span className="bn text-xs px-2 py-0.5 rounded-full" style={{ background: IMPORTANCE_CONFIG[imp].bg, color: IMPORTANCE_CONFIG[imp].color }}>
                      {IMPORTANCE_CONFIG[imp].label}
                    </span>
                    <span className="bn text-xs" style={{ color: "var(--muted)" }}>
                      {imp === "must" ? "— ছাড়া রান্না হবে না" : imp === "medium" ? "— থাকলে ভালো হয়" : "— না থাকলেও চলে"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEPS ── */}
          {step === "steps" && (
            <motion.div key="steps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="bn text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>রান্নার ধাপ</h2>
              <p className="bn text-sm mb-5" style={{ color: "var(--muted)" }}>ধাপে ধাপে বলো কীভাবে রান্না হবে।</p>

              <div className="flex flex-col gap-3">
                {steps.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="rounded-2xl p-4" style={{ background: "var(--surface)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "var(--gold)", color: "white" }}>
                        {i + 1}
                      </div>
                      <span className="bn text-xs" style={{ color: "var(--muted)" }}>ধাপ {i + 1}</span>
                      <button onClick={() => removeStep(s.id)} className="ml-auto text-sm" style={{ color: "var(--muted)" }}>×</button>
                    </div>
                    <textarea
                      value={s.instruction}
                      onChange={(e) => updateStep(s.id, "instruction", e.target.value)}
                      placeholder="এই ধাপে কী করতে হবে লিখো..."
                      rows={3}
                      className="bn w-full rounded-xl px-3 py-2.5 text-sm resize-none"
                      style={inputStyle}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bn text-xs" style={{ color: "var(--muted)" }}>সময়:</span>
                      <input
                        type="number"
                        value={s.timeMinutes}
                        onChange={(e) => updateStep(s.id, "timeMinutes", Number(e.target.value))}
                        className="bn w-16 rounded-lg px-2 py-1.5 text-sm text-center"
                        style={inputStyle}
                      />
                      <span className="bn text-xs" style={{ color: "var(--muted)" }}>মিনিট</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={addStep} className="bn w-full mt-3 py-3 rounded-xl text-sm font-medium"
                style={{ background: "var(--surface-2)", color: "var(--gold)", border: "1.5px dashed var(--gold)" }}>
                + আরেকটি ধাপ যোগ করো
              </button>
            </motion.div>
          )}

          {/* ── MOTHER VOICE ── */}
          {step === "voice" && (
            <motion.div key="voice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="bn text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>তোমার কথায়</h2>
              <p className="bn text-sm mb-5" style={{ color: "var(--muted)" }}>
                তুমি যেভাবে রান্না বোঝাও — ঠিক সেভাবেই লিখো। সংশোধন করতে হবে না।
              </p>

              <Field label="তোমার নিজের ভাষায় বলো">
                <textarea
                  value={motherVoice}
                  onChange={(e) => setMotherVoice(e.target.value)}
                  placeholder='যেমন: "তেলটা ভালো গরম হলে পেঁয়াজ দিবা। একটু পোড়া পোড়া গন্ধ আসলে বুঝবা হয়েছে।"'
                  rows={5}
                  className="bn w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ ...inputStyle, lineHeight: "1.8" }}
                />
              </Field>

              <Field label="একটা ছোট মনে রাখার কথা" className="mt-4">
                <input
                  value={motherNote}
                  onChange={(e) => setMotherNote(e.target.value)}
                  placeholder='যেমন: "তেল ভাসলেই বুঝবা হয়েছে।"'
                  className="bn w-full rounded-xl px-4 py-3 text-sm"
                  style={inputStyle}
                />
              </Field>

              <div className="mt-5 rounded-2xl p-4" style={{ background: "var(--surface-2)" }}>
                <p className="bn text-xs font-semibold mb-2" style={{ color: "var(--terra)" }}>💡 এটা কেন গুরুত্বপূর্ণ?</p>
                <p className="bn text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  তোমার নিজের কথাগুলো — কোনো পরিবর্তন ছাড়া — ব্যবহারকারীরা দেখবে।
                  এটাই তোমার রেসিপিকে আলাদা করে। তোমার ভাষা, তোমার অভিজ্ঞতা।
                </p>
              </div>
            </motion.div>
          )}

          {/* ── PREVIEW ── */}
          {step === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="bn text-xl font-semibold mb-5" style={{ color: "var(--text)" }}>প্রিভিউ</h2>

              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <h3 className="bn text-xl font-semibold" style={{ color: "var(--text)" }}>{name || "(নাম নেই)"}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--muted)", fontFamily: "'DM Sans'" }}>{nameEn}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="bn text-sm" style={{ color: "var(--muted)" }}>⏱️ {timeMinutes} মিনিট</span>
                    <span className="bn text-sm" style={{ color: "var(--muted)" }}>👥 {servings} জন</span>
                  </div>
                </div>

                {motherVoice && (
                  <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="bn text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>তোমার কথায়</p>
                    <p className="bn text-sm leading-relaxed italic" style={{ color: "var(--terra)" }}>"{motherVoice}"</p>
                    {motherNote && <p className="bn text-xs mt-2 font-medium" style={{ color: "var(--gold)" }}>💛 "{motherNote}"</p>}
                  </div>
                )}

                <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="bn text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>উপকরণ ({ingredients.filter((i) => i.name).length}টি)</p>
                  {ingredients.filter((i) => i.name).map((ing) => (
                    <div key={ing.id} className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: ing.importance === "must" ? "var(--terra)" : ing.importance === "medium" ? "var(--gold)" : "var(--border)" }} />
                      <span className="bn text-sm" style={{ color: "var(--text)" }}>{ing.name}</span>
                      <span className="bn text-sm ml-auto" style={{ color: "var(--muted)" }}>{ing.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4">
                  <p className="bn text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>ধাপ ({steps.filter((s) => s.instruction).length}টি)</p>
                  {steps.filter((s) => s.instruction).map((s, i) => (
                    <div key={s.id} className="flex gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--gold)", color: "white" }}>{i + 1}</div>
                      <p className="bn text-sm" style={{ color: "var(--text)" }}>{s.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl p-4" style={{ background: "#D1FAE5" }}>
                <p className="bn text-sm font-semibold" style={{ color: "#065F46" }}>🎉 জমা দেওয়ার পর কী হবে?</p>
                <p className="bn text-xs mt-1.5 leading-relaxed" style={{ color: "#064E3B" }}>
                  আমাদের টিম তোমার রেসিপি পর্যালোচনা করবে। অনুমোদনের পর এটি সবার কাছে দেখা যাবে।
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        {step !== "preview" ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(STEPS_ORDER[currentIdx + 1])}
            className="bn w-full py-4 rounded-2xl font-semibold text-base"
            style={{ background: "var(--gold)", color: "white", boxShadow: "0 4px 24px rgba(212,146,10,0.35)" }}
          >
            পরের ধাপ →
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="bn w-full py-4 rounded-2xl font-semibold text-base"
            style={{ background: "var(--green)", color: "white", boxShadow: "0 4px 24px rgba(74,124,89,0.35)" }}
          >
            রেসিপি জমা দাও 🙏
          </motion.button>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  color: "var(--text)",
  border: "1px solid var(--border)",
  outline: "none",
  fontFamily: "'Hind Siliguri', sans-serif",
  width: "100%",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "0.875rem",
};

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="bn text-sm font-medium mb-2" style={{ color: "var(--text)" }}>{label}</p>
      {children}
    </div>
  );
}
