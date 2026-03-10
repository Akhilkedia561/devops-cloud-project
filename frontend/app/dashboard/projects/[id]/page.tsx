"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Rocket, RotateCcw, Terminal } from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params?.id as string;

  const [deploying, setDeploying] = useState(false);

  const startDeploy = () => {
    setDeploying(true);

    setTimeout(() => {
      setDeploying(false);
    }, 4000);
  };

  /* ---------------- MOCK DEPLOYMENTS ---------------- */

  const deployments = [
    {
      id: "dep_1",
      status: "Success",
      commit: "a1f3e2c",
      branch: "main",
      time: "2 min ago",
    },
    {
      id: "dep_2",
      status: "Building",
      commit: "b4c8e1a",
      branch: "dev",
      time: "5 min ago",
    },
    {
      id: "dep_3",
      status: "Success",
      commit: "d1e7a3b",
      branch: "main",
      time: "1 hr ago",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            {projectId}
          </h1>

          <p className="text-gray-400 text-sm">
            GitHub repository deployment dashboard
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={startDeploy}
            className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-400 transition shadow-lg shadow-green-500/20"
          >
            <Rocket size={16} />
            Deploy
          </button>

          <button className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-[#1a1a1a] transition">
            <RotateCcw size={16} />
            Restart
          </button>

        </div>

      </div>

      {/* PROJECT OVERVIEW */}

      <div className="grid md:grid-cols-3 gap-4">

        <OverviewCard title="Status" value="Running" green />
        <OverviewCard title="Last Deploy" value="2 min ago" />
        <OverviewCard title="Branch" value="main" />

      </div>

      {/* PIPELINE */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">

        <h2 className="text-white text-lg mb-6">
          Deployment Pipeline
        </h2>

        <div className="flex justify-between">

          <PipelineStage label="Git Push" active />
          <PipelineStage label="Build" active />
          <PipelineStage label="Docker" active />
          <PipelineStage label="Deploy" active={deploying} />
          <PipelineStage label="Live" active={!deploying} />

        </div>

      </div>

      {/* DEPLOYMENT HISTORY */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">

        <h2 className="text-white text-lg font-medium mb-4">
          Deployment History
        </h2>

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="text-left py-3">Status</th>
              <th className="text-left">Commit</th>
              <th className="text-left">Branch</th>
              <th className="text-left">Time</th>
            </tr>
          </thead>

          <tbody>

            {deployments.map((dep) => (

              <tr
                key={dep.id}
                onClick={() =>
                  router.push(`/dashboard/deployments/${dep.id}`)
                }
                className="cursor-pointer border-b border-gray-800 hover:bg-[#1a1a1a] transition"
              >

                <td>
                  <StatusBadge status={dep.status} />
                </td>

                <td className="font-mono text-gray-300">
                  {dep.commit}
                </td>

                <td className="text-gray-400">
                  {dep.branch}
                </td>

                <td className="text-gray-400">
                  {dep.time}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ENV VARIABLES */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6">

        <h2 className="text-white mb-4 text-lg">
          Environment Variables
        </h2>

        <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1 text-green-400">

          <div>NEXT_PUBLIC_API_URL=https://api.shipstack.dev</div>
          <div>NODE_ENV=production</div>
          <div>REDIS_HOST=redis.shipstack.internal</div>

        </div>

      </div>

      {/* LIVE LOGS */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6">

        <h2 className="text-white mb-4 text-lg flex items-center gap-2">
          <Terminal size={18} />
          Live Deployment Logs
        </h2>

        <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 space-y-1 h-48 overflow-y-auto">

          <div>[INFO] Cloning repository...</div>
          <div>[INFO] Installing dependencies...</div>
          <div>[INFO] Building Docker image...</div>
          <div>[INFO] Pushing image...</div>
          <div className="text-green-500">
            [SUCCESS] Deployment finished
          </div>

        </div>

      </div>

    </div>
  );
}

/* COMPONENTS */

function OverviewCard({
  title,
  value,
  green,
}: {
  title: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 hover:border-green-500 transition">

      <p className="text-gray-400 text-sm">{title}</p>

      <p
        className={`text-2xl font-semibold mt-1 ${
          green
            ? "text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-white text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function PipelineStage({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">

      <div
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
          active
            ? "bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
            : "border-gray-700 text-gray-500"
        }`}
      >
        ✓
      </div>

      <span className="text-gray-400 text-sm">{label}</span>

    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Success: "bg-green-900 text-green-400 border-green-500",
    Building: "bg-yellow-900 text-yellow-400 border-yellow-500",
    Failed: "bg-red-900 text-red-400 border-red-500",
  };

  return (
    <span className={`px-2 py-1 text-xs border rounded-md ${styles[status]}`}>
      {status}
    </span>
  );
}