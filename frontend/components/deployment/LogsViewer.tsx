"use client";

import { useEffect, useRef } from "react";

type LogEntry = {
  timestamp: string;
  message: string;
};

interface LogsViewerProps {
  logs: LogEntry[];
}

export default function LogsViewer({ logs }: LogsViewerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-4 h-[420px] overflow-y-auto font-mono text-sm">
      {logs.length === 0 && (
        <p className="text-gray-600">Waiting for logs...</p>
      )}

      {logs.map((log, i) => (
        <div key={i} className="flex gap-3 text-green-400">
          <span className="text-gray-600 shrink-0">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
          <span>{log.message}</span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}