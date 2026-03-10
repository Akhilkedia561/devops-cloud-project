"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">

      <div className="flex items-center gap-8 px-8 py-3 rounded-full
      border border-white/10 bg-black/40 backdrop-blur-xl">

        <div className="font-semibold tracking-wide text-white">
          Ship<span className="text-blue-400">Stack</span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm text-gray-300">

          <NavLink href="#about">About</NavLink>
          <NavLink href="#features">Features</NavLink>

          <Link
            href="/dashboard"
            className="hover:text-white transition"
          >
            Dashboard
          </Link>

        </nav>

        <Link
          href="/dashboard"
          className="ml-2 rounded-full bg-white text-black px-4 py-1.5 text-sm font-medium hover:scale-105 transition"
        >
          Get Started
        </Link>

      </div>

    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="relative text-gray-300 hover:text-white transition"
    >
      {children}
    </a>
  );
}