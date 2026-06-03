"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "হোম", emoji: "🏠" },
  { href: "/cook", label: "রান্না", emoji: "🍳" },
  { href: "/mothers", label: "মায়েরা", emoji: "👩‍🍳" },
  { href: "/ma", label: "আমার পেজ", emoji: "📋" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl"
                style={{
                  background: isActive ? "var(--surface-2)" : "transparent",
                }}
              >
                <span className="text-xl">{item.emoji}</span>
                <span
                  className="bn text-xs font-medium"
                  style={{
                    color: isActive ? "var(--gold)" : "var(--muted)",
                    fontSize: "0.65rem",
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
