// components/Sidebar.tsx
"use client"
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        {[
          { label: "About", href: "#about" },
          { label: "Features", href: "#features" },
          { label: "Start", href: "/dashboard" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative text-sm text-gray-300 hover:text-white transition"
          >
            <span className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
