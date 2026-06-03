"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import mothers from "@/data/mothers.json";
import type { Mother } from "@/lib/types";

const featuredMothers = (mothers as Mother[]).slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-dvh pb-32" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-6 pt-10 pb-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🍲</span>
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Mayer Haat er Ranna
          </span>
        </div>
        <h1
          className="bn text-3xl font-semibold leading-tight"
          style={{ color: "var(--text)" }}
        >
          মায়ের হাতের রান্না
        </h1>
        <p
          className="bn mt-2 text-base font-light leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          কারো মায়ের হাতের রান্না —<br />তোমার রান্নাঘরে।
        </p>
      </motion.header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mx-6 mt-6 rounded-2xl overflow-hidden relative"
        style={{ background: "var(--terra)" }}
      >
        <div className="px-6 py-7 relative z-10">
          <p className="text-white/70 text-xs font-light mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            কারো মা আগেই সমাধান করেছেন তোমার প্রশ্নটা।
          </p>
          <p className="bn text-white text-lg font-medium leading-snug">
            তোমার ফ্রিজে কী আছে বলো —<br />
            কোনো মায়ের রেসিপি বলে দেবে<br />
            কী রান্না করবে।
          </p>
          <Link href="/cook" className="block mt-5">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="touch-target w-full rounded-xl py-4 text-center font-semibold text-base bn"
              style={{ background: "var(--gold)", color: "white" }}
            >
              আমি রান্না করতে চাই 🍳
            </motion.div>
          </Link>
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
      </motion.section>

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mx-6 mt-6 rounded-2xl p-5"
        style={{ background: "var(--surface)" }}
      >
        <h3 className="bn font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
          কীভাবে কাজ করে?
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { icon: "🧅", text: "তোমার কাছে কী কী আছে বলো" },
            { icon: "🔍", text: "AI মিলিয়ে দেখে কোন মায়ের রেসিপি সবচেয়ে কাছের" },
            { icon: "👩‍🍳", text: "সেই মায়ের নিজের ভাষায় রান্না শেখো" },
            { icon: "⭐", text: "রান্না করো, রেটিং দাও" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base w-6 text-center">{item.icon}</span>
              <span className="bn text-sm" style={{ color: "var(--muted)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Mother cards */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-7 px-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="bn text-base font-semibold" style={{ color: "var(--text)" }}>
            আমাদের রাঁধুনিরা
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {featuredMothers.map((mother, i) => (
            <motion.div
              key={mother.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
            >
              <Link href={`/mother/${mother.id}`}>
                <motion.div
                  whileTap={{ scale: 0.99 }}
                  className="rounded-2xl p-4 flex items-start gap-4"
                  style={{ background: "var(--surface)" }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: "var(--surface-2)" }}
                  >
                    {["👩", "👩‍🍳", "🧕"][i]}
                  </div>
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
                      className="bn text-sm mt-1.5 font-medium"
                      style={{ color: "var(--terra)", fontStyle: "italic" }}
                    >
                      "{mother.philosophy}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {mother.specialties.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="bn text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--surface-2)", color: "var(--muted)" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <Link href="/cook">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl font-semibold text-center text-base bn"
            style={{
              background: "var(--gold)",
              color: "white",
              boxShadow: "0 4px 24px rgba(212,146,10,0.35)",
            }}
          >
            🍲 আমি রান্না করতে চাই
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
