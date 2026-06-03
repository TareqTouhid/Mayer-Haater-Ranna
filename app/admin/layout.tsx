"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: "📊", exact: true },
  { href: "/admin/mothers", label: "মায়েরা", icon: "👩", exact: false },
  { href: "/admin/recipes", label: "রেসিপি", icon: "📋", exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-dvh flex" style={{ background: "#0F0F0F", maxWidth: "100vw" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r" style={{ background: "#161616", borderColor: "#2A2A2A", minHeight: "100dvh" }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: "#2A2A2A" }}>
          <p className="bn text-white font-semibold text-sm">মায়ের হাতের রান্না</p>
          <p className="text-xs mt-0.5" style={{ color: "#666", fontFamily: "'DM Sans'" }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {NAV.map((item) => {
            const active = item.exact ? path === item.href : path.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm bn"
                  style={{
                    background: active ? "#D4920A18" : "transparent",
                    color: active ? "#D4920A" : "#888",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "#2A2A2A" }}>
          <p className="text-xs" style={{ color: "#555", fontFamily: "'DM Sans'" }}>Admin · v1.0</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ background: "#0F0F0F" }}>
        {children}
      </main>
    </div>
  );
}
