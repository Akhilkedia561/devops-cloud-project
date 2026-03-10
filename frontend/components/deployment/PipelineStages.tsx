"use client";

import { CheckCircle, Loader2, Circle } from "lucide-react";

interface Stage {
  name: string;
  status: "done" | "running" | "pending";
}

export default function PipelineStages() {
  const stages: Stage[] = [
    { name: "Clone Repository", status: "done" },
    { name: "Install Dependencies", status: "done" },
    { name: "Build Application", status: "running" },
    { name: "Docker Build", status: "pending" },
    { name: "Start Container", status: "pending" },
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <h2 className="text-lg font-medium text-white mb-4">
        Deployment Pipeline
      </h2>

      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-300"
          >
            {stage.status === "done" && (
              <CheckCircle size={16} className="text-green-400" />
            )}

            {stage.status === "running" && (
              <Loader2 size={16} className="animate-spin text-blue-400" />
            )}

            {stage.status === "pending" && (
              <Circle size={16} className="text-gray-600" />
            )}

            {stage.name}
          </div>
        ))}
      </div>
    </div>
  );
}