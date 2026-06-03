"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { store, PendingMother } from "@/lib/store";

const MOTIVATION_OPTIONS = [
  { value: "legacy", label: "রেসিপি সংরক্ষণ", desc: "আমার রান্নার জ্ঞান টিকিয়ে রাখতে চাই", emoji: "📜" },
  { value: "income", label: "রান্না থেকে আয়", desc: "রান্না করে উপার্জন করতে চাই", emoji: "💚" },
  { value: "recognition", label: "পরিচিত হতে চাই", desc: "আমার রান্নার গুণ সবাইকে জানাতে চাই", emoji: "⭐" },
] as const;

const ZILLAS = [
  "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট",
  "রংপুর", "ময়মনসিংহ", "কুমিল্লা", "নারায়ণগঞ্জ", "গাজীপুর", "অন্যান্য",
];

export default function MaProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [zilla, setZilla] = useState("");
  const [phone, setPhone] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [story, setStory] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [motivation, setMotivation] = useState<"legacy" | "income" | "recognition">("legacy");
  const [submitted, setSubmitted] = useState(false);

  function addSpecialty() {
    if (specialtyInput.trim() && specialties.length < 5) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  }

  function handleSubmit() {
    const m: PendingMother = {
      id: `ma-${Date.now()}`,
      name,
      nameEn: name,
      age: Number(age),
      zilla,
      phone,
      philosophy,
      story,
      specialties,
      motivation,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    store.savePendingMother(m);
    store.setCurrentMotherId(m.id);
    setSubmitted(true);
  }

  const canSubmit = name && age && zilla && phone && philosophy && story && specialties.length > 0;

  if (submitted) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <span className="text-6xl block mb-4">🙏</span>
          <h2 className="bn text-2xl font-semibold mb-3" style={{ color: "var(--text)" }}>আবেদন জমা হয়েছে!</h2>
          <p className="bn text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
            তোমার প্রোফাইল আমাদের টিম পর্যালোচনা করছে।<br />
            সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে জানানো হবে।
          </p>
          <button
            onClick={() => router.push("/ma")}
            className="bn py-4 px-8 rounded-2xl font-semibold"
            style={{ background: "var(--gold)", color: "white" }}
          >
            ড্যাশবোর্ডে যাও →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-36" style={{ background: "var(--bg)" }}>
      <div className="flex items-center gap-3 px-6 pt-10 pb-4">
        <button onClick={() => router.back()} className="touch-target w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "var(--surface)" }}>←</button>
        <div>
          <h1 className="bn font-semibold text-base" style={{ color: "var(--text)" }}>প্রোফাইল তৈরি করো</h1>
          <p className="bn text-xs" style={{ color: "var(--muted)" }}>মায়ের রান্না পরিবারে যোগ দাও</p>
        </div>
      </div>

      <div className="px-6">
        {/* Avatar placeholder */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl" style={{ background: "var(--surface-2)" }}>👩</div>
          <p className="bn text-xs mt-2" style={{ color: "var(--muted)" }}>ছবি যোগ করো (শীঘ্রই আসছে)</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">

          <Field label="তোমার নাম *">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: রহিমা বেগম" className="bn" style={inputStyle} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="বয়স *">
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="৪৫" className="bn text-center" style={inputStyle} />
            </Field>
            <Field label="ফোন *">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="০১XXXXXXXXX" className="bn" style={inputStyle} />
            </Field>
          </div>

          <Field label="জেলা *">
            <div className="flex flex-wrap gap-2">
              {ZILLAS.map((z) => (
                <button key={z} onClick={() => setZilla(z)}
                  className="bn text-sm px-3 py-1.5 rounded-full"
                  style={{ background: zilla === z ? "var(--gold)" : "var(--surface-2)", color: zilla === z ? "white" : "var(--text)" }}>
                  {z}
                </button>
              ))}
            </div>
          </Field>

          <Field label="তোমার রান্নার দর্শন *">
            <input value={philosophy} onChange={(e) => setPhilosophy(e.target.value)} placeholder='যেমন: "মশলা কম, ঘ্রাণ বেশি"' className="bn" style={inputStyle} />
          </Field>

          <Field label="তোমার গল্প *">
            <textarea value={story} onChange={(e) => setStory(e.target.value)}
              placeholder="কোথায় বড় হয়েছো, কখন থেকে রান্না করছো, রান্নার সাথে তোমার সম্পর্ক..."
              rows={4} className="bn resize-none w-full" style={inputStyle} />
          </Field>

          <Field label={`বিশেষত্ব (${specialties.length}/5) *`}>
            <div className="flex flex-wrap gap-2 mb-2">
              {specialties.map((s) => (
                <span key={s} className="bn text-sm px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "var(--gold)", color: "white" }}>
                  {s} <button onClick={() => setSpecialties(specialties.filter((x) => x !== s))} className="opacity-70">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={specialtyInput} onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(); } }}
                placeholder="যেমন: ইলিশ রান্না" className="bn flex-1" style={inputStyle} />
              <button onClick={addSpecialty} className="px-4 rounded-xl bn text-sm" style={{ background: "var(--gold)", color: "white" }}>যোগ</button>
            </div>
          </Field>

          <Field label="তুমি কেন যোগ দিচ্ছো? *">
            <div className="flex flex-col gap-2">
              {MOTIVATION_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setMotivation(opt.value)}
                  className="rounded-2xl p-4 flex items-start gap-3 text-left"
                  style={{ background: motivation === opt.value ? "var(--gold)" : "var(--surface)", border: motivation === opt.value ? "none" : "1px solid var(--border)" }}>
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <p className="bn font-semibold text-sm" style={{ color: motivation === opt.value ? "white" : "var(--text)" }}>{opt.label}</p>
                    <p className="bn text-xs mt-0.5" style={{ color: motivation === opt.value ? "white/80" : "var(--muted)" }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Field>
        </motion.div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <motion.button whileTap={{ scale: canSubmit ? 0.97 : 1 }} onClick={handleSubmit} disabled={!canSubmit}
          className="bn w-full py-4 rounded-2xl font-semibold text-base"
          style={{ background: canSubmit ? "var(--gold)" : "var(--border)", color: canSubmit ? "white" : "var(--muted)", boxShadow: canSubmit ? "0 4px 24px rgba(212,146,10,0.35)" : "none", transition: "all 0.3s ease" }}>
          {canSubmit ? "আবেদন জমা দাও 🙏" : "সব তথ্য পূরণ করো"}
        </motion.button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)",
  outline: "none", fontFamily: "'Hind Siliguri', sans-serif", width: "100%",
  borderRadius: "12px", padding: "10px 14px", fontSize: "0.875rem",
};

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="bn text-sm font-medium mb-2" style={{ color: "var(--text)" }}>{label}</p>
      {children}
    </div>
  );
}
