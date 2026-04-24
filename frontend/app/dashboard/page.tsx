"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from "recharts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Deployment = {
  deploymentId: string;
  repo: string;
  branch: string;
  framework: string;
  status: string;
  createdAt: string;
};

// ── Build last-7-days chart data from real deployments ────────────────────────
function buildChartData(deployments: Deployment[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();

  // Build array of last 7 days oldest → newest
  const buckets = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return {
      day: days[d.getDay()],
      date: d.toDateString(),
      deployments: 0,
      successful: 0,
    };
  });

  deployments.forEach(dep => {
    const depDate = new Date(dep.createdAt).toDateString();
    const bucket = buckets.find(b => b.date === depDate);
    if (!bucket) return;
    bucket.deployments++;
    if (dep.status === "SUCCESS") bucket.successful++;
  });

  return buckets;
}

export default function DashboardPage() {
  const router = useRouter();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/backend/api/deploy")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setDeployments(data.deployments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = buildChartData(deployments);
  const totalToday = chartData[6].deployments;
  const failedCount = deployments.filter(d => d.status === "FAILED").length;
  const successRate = deployments.length
    ? Math.round((deployments.filter(d => d.status === "SUCCESS").length / deployments.length) * 100)
    : 100;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-wide">Dashboard</h1>
          <p className="text-sm text-gray-400">Overview of your projects and deployments</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/new-project")}
          className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-400 transition shadow-lg shadow-green-500/20"
        >
          + New Project
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Deployments" value={String(deployments.length)} />
        <StatCard
          title="Successful"
          value={String(deployments.filter(d => d.status === "SUCCESS").length)}
        />
        <StatCard title="Failed" value={String(failedCount)} danger={failedCount > 0} />
        <StatCard title="Success Rate" value={`${successRate}%`} status />
      </div>

      {/* CHART — real data from backend */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between mb-6 items-start">
          <div>
            <h2 className="text-white text-lg font-medium">Deployments This Week</h2>
            <p className="text-gray-500 text-xs mt-1 font-mono">
              {totalToday} deployment{totalToday !== 1 ? "s" : ""} today
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Successful
            </span>
            <span className="text-gray-600">Last 7 days</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="day" stroke="#4b5563" tick={{ fontSize: 12, fontFamily: "monospace" }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 12, fontFamily: "monospace" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #1f2937", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Area type="monotone" dataKey="deployments" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradGreen)" dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="successful" stroke="#3b82f6" strokeWidth={2} fill="url(#gradBlue)" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* DEPLOYMENTS TABLE */}
      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-medium">Recent Deployments</h2>
          <span className="text-gray-600 text-xs font-mono">{deployments.length} total</span>
        </div>

        {loading && <p className="text-gray-400 text-sm font-mono">Fetching deployments...</p>}

        {!loading && deployments.length === 0 && (
          <p className="text-gray-400 text-sm">No deployments yet. Create your first project.</p>
        )}

        {!loading && deployments.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b border-gray-800 font-mono text-xs tracking-widest uppercase">
              <tr>
                <th className="text-left py-3">Repository</th>
                <th className="text-left">Branch</th>
                <th className="text-left">Framework</th>
                <th className="text-left">Status</th>
                <th className="text-left">Time</th>
                <th className="text-left">ID</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr
                  key={d.deploymentId}
                  onClick={() => router.push(`/projects/${d.deploymentId}`)}
                  className="cursor-pointer border-b border-gray-800/60 hover:bg-white/[0.02] transition"
                >
                  <td className="py-3 font-medium text-white">{d.repo}</td>
                  <td className="text-gray-400 font-mono text-xs">{d.branch}</td>
                  <td className="text-gray-400 font-mono text-xs">{d.framework}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="text-gray-500 font-mono text-xs">
                    {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="text-gray-600 font-mono text-xs">{d.deploymentId.slice(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, status, danger }: {
  title: string; value: string; status?: boolean; danger?: boolean;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 hover:border-green-500/40 transition">
      <h2 className="text-gray-500 text-xs font-mono tracking-widest uppercase">{title}</h2>
      <p className={`text-3xl font-semibold mt-2 ${
        danger ? "text-red-400" : status ? "text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" : "text-white"
      }`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS:  "bg-green-900/40 text-green-400 border-green-500/30",
    BUILDING: "bg-yellow-900/40 text-yellow-400 border-yellow-500/30",
    CLONING:  "bg-blue-900/40 text-blue-400 border-blue-500/30",
    QUEUED:   "bg-gray-800 text-gray-400 border-gray-600/30",
    FAILED:   "bg-red-900/40 text-red-400 border-red-500/30",
  };
  return (
    <span className={`px-2 py-1 text-xs border rounded-md font-mono ${styles[status] ?? "bg-gray-800 text-gray-400 border-gray-600"}`}>
      {status}
    </span>
  );
}