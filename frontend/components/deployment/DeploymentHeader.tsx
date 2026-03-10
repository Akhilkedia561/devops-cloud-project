"use client";

import { Rocket, GitBranch, CheckCircle, Loader2 } from "lucide-react";

interface DeploymentHeaderProps {
  project?: string;
  branch?: string;
  commit?: string;
  status?: "building" | "success" | "failed";
}

export default function DeploymentHeader({
  project = "ShipStack Frontend",
  branch = "main",
  commit = "a1f3e2c",
  status = "building",
}: DeploymentHeaderProps) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-white">{project}</h1>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <GitBranch size={14} />
            {branch}
          </span>

          <span className="font-mono">{commit}</span>

          <span className="flex items-center gap-1">
            {status === "building" && (
              <>
                <Loader2 size={14} className="animate-spin" />
                Building
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle size={14} className="text-green-400" />
                Deployed
              </>
            )}
          </span>
        </div>
      </div>

      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm">
        <Rocket size={14} />
        Redeploy
      </button>
    </div>
  );
}