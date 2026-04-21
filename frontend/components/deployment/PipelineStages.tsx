"use client";

import { CheckCircle, Loader2, Circle } from "lucide-react";

interface PipelineStagesProps {
  status: string;
}

type StageStatus = "done" | "running" | "pending";

interface Stage {
  name: string;
  status: StageStatus;
}

function deriveStages(status: string): Stage[] {
  const map: Record<string, number> = {
    QUEUED: 0,
    CLONING: 1,
    BUILDING: 2,
    SUCCESS: 3,
    FAILED: 3,
  };

  const activeIndex = map[status] ?? 0;

  const stageNames = [
    "Queue",
    "Clone Repository",
    "Build Application",
    "Docker Build (CI/CD)",
  ];

  return stageNames.map((name, i) => {
    if (i < activeIndex) return { name, status: "done" };
    if (i === activeIndex) {
      if (status === "SUCCESS") return { name, status: "done" };
      if (status === "FAILED") return { name, status: "pending" };
      return { name, status: "running" };
    }
    return { name, status: "pending" };
  });
}

export default function PipelineStages({ status }: PipelineStagesProps) {
  const stages = deriveStages(status);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <h2 className="text-lg font-medium text-white mb-4">
        Deployment Pipeline
      </h2>

      <div className="space-y-3">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
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