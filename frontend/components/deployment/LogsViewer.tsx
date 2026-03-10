"use client";

import { useEffect, useRef } from "react";

export default function LogsViewer() {
  const logs = [
    "[clone] cloning repository...",
    "[clone] repository cloned",
    "[install] npm install",
    "[install] dependencies installed",
    "[build] building project...",
    "[build] compiling modules",
    "[build] build successful",
  ];

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-4 h-[420px] overflow-y-auto font-mono text-sm text-green-400">
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}