"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Rocket, FolderGit2, ScrollText, Settings, LogOut
} from "lucide-react";

const NAV = [
  { label: "Overview",     href: "/dashboard",             icon: LayoutDashboard },
  { label: "New Project",  href: "/dashboard/new-project", icon: Rocket          },

];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#030508", color: "#fff", fontFamily: "monospace" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
        background: "#030508",
      }}>

        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#00ff8c", fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>⬡ ShipStack</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 10px" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                  background: active ? "rgba(0,255,140,0.07)" : "transparent",
                  borderLeft: `2px solid ${active ? "#00ff8c" : "transparent"}`,
                  color: active ? "#00ff8c" : "rgba(255,255,255,0.45)",
                  fontSize: 13, transition: "all .2s", cursor: "pointer",
                }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.75)" }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.45)" }}
                >
                  <Icon size={15} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {user?.imageUrl && (
              <img src={user.imageUrl} alt="avatar" style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(0,255,140,0.3)" }} />
            )}
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{user?.username ?? user?.firstName}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>Pro plan</div>
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); router.push("/"); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.35)",
              fontSize: 12, transition: "all .2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        {children}
      </main>

    </div>
  );
}