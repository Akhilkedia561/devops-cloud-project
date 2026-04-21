"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const deploymentData = [
  { day: "Mon", deployments: 1 },
  { day: "Tue", deployments: 3 },
  { day: "Wed", deployments: 2 },
  { day: "Thu", deployments: 5 },
  { day: "Fri", deployments: 4 },
  { day: "Sat", deployments: 2 },
  { day: "Sun", deployments: 6 },
];

type Deployment = {
  deploymentId: string;
  repo: string;
  branch: string;
  framework: string;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/backend/api/deploy")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setDeployments(data.deployments);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Overview of your projects and deployments
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/new-project")}
          className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-400 transition shadow-lg shadow-green-500/20"
        >
          + New Project
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Deployments" value={String(deployments.length)} />
        <StatCard
          title="Successful"
          value={String(deployments.filter(d => d.status === "SUCCESS").length)}
        />
        <StatCard
          title="System Status"
          value="Healthy"
          status
        />
      </div>

      {/* CHART */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-white text-lg font-medium">
            Deployments This Week
          </h2>
          <span className="text-gray-400 text-sm">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={deploymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
            <Line type="monotone" dataKey="deployments" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* DEPLOYMENTS TABLE */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-white text-lg font-medium mb-4">
          Recent Deployments
        </h2>

        {loading && (
          <p className="text-gray-400 text-sm">Loading deployments...</p>
        )}

        {!loading && deployments.length === 0 && (
          <p className="text-gray-400 text-sm">
            No deployments yet. Create your first project.
          </p>
        )}

        {!loading && deployments.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-3">Repository</th>
                <th className="text-left">Branch</th>
                <th className="text-left">Framework</th>
                <th className="text-left">Status</th>
                <th className="text-left">ID</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr
                  key={d.deploymentId}
                  onClick={() => router.push(`/projects/${d.deploymentId}`)}
                  className="cursor-pointer border-b border-gray-800 hover:bg-[#1a1a1a] transition"
                >
                  <td className="py-3 font-medium text-white">{d.repo}</td>
                  <td className="text-gray-400">{d.branch}</td>
                  <td className="text-gray-400">{d.framework}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="text-gray-500 font-mono text-xs">
                    {d.deploymentId.slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, status }: {
  title: string;
  value: string;
  status?: boolean;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 hover:border-green-500 transition">
      <h2 className="text-gray-400 text-sm">{title}</h2>
      <p className={`text-3xl font-semibold mt-1 ${status
        ? "text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]"
        : "text-white"
        }`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: "bg-green-900 text-green-400 border-green-500",
    BUILDING: "bg-yellow-900 text-yellow-400 border-yellow-500",
    CLONING: "bg-blue-900 text-blue-400 border-blue-500",
    QUEUED: "bg-gray-800 text-gray-400 border-gray-600",
    FAILED: "bg-red-900 text-red-400 border-red-500",
  };

  return (
    <span className={`px-2 py-1 text-xs border rounded-md ${styles[status] ?? "bg-gray-800 text-gray-400 border-gray-600"}`}>
      {status}
    </span>
  );
}