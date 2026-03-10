"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useRouter } from "next/navigation";

/* ---------------- MOCK DATA ---------------- */

const deploymentData = [
  { day: "Mon", deployments: 1 },
  { day: "Tue", deployments: 3 },
  { day: "Wed", deployments: 2 },
  { day: "Thu", deployments: 5 },
  { day: "Fri", deployments: 4 },
  { day: "Sat", deployments: 2 },
  { day: "Sun", deployments: 6 },
];

const projects = [
  {
    id: "frontend",
    name: "ShipStack Frontend",
    repo: "github.com/user/frontend",
    status: "Running",
    lastDeploy: "2 min ago",
  },
  {
    id: "worker",
    name: "ShipStack Worker",
    repo: "github.com/user/worker",
    status: "Building",
    lastDeploy: "5 min ago",
  },
  {
    id: "docs",
    name: "ShipStack Docs",
    repo: "github.com/user/docs",
    status: "Running",
    lastDeploy: "1 hr ago",
  },
];

const logs = [
  "[INFO] Cloning repository...",
  "[INFO] Installing dependencies...",
  "[INFO] Building Docker image...",
  "[INFO] Pushing image to registry...",
  "[SUCCESS] Deployment completed",
];

/* ---------------- PAGE ---------------- */

export default function DashboardPage() {
  const router = useRouter();

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
        <StatCard title="Projects" value="3" />
        <StatCard title="Deployments Today" value="6" />
        <StatCard title="System Status" value="Healthy" status />
      </div>

      {/* INFRA METRICS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value="42%" />
        <MetricCard title="Memory Usage" value="2.1 GB" />
        <MetricCard title="Containers" value="6 Running" />
        <MetricCard title="Cluster Nodes" value="2" />
      </div>

      {/* CHART */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-white text-lg font-medium">
            Deployments This Week
          </h2>

          <span className="text-gray-400 text-sm">
            Last 7 days
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={deploymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
              }}
            />
            <Line
              type="monotone"
              dataKey="deployments"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PROJECTS TABLE */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">

        <h2 className="text-white text-lg font-medium mb-4">
          Projects
        </h2>

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="text-left py-3">Project</th>
              <th className="text-left">Repository</th>
              <th className="text-left">Status</th>
              <th className="text-left">Last Deploy</th>
            </tr>
          </thead>

          <tbody>

            {projects.map((project) => (

              <tr
                key={project.id}
                onClick={() =>
                  router.push(`/dashboard/projects/${project.id}`)
                }
                className="cursor-pointer border-b border-gray-800 hover:bg-[#1a1a1a] transition"
              >

                <td className="py-3 font-medium text-white">
                  {project.name}
                </td>

                <td className="text-gray-400">
                  {project.repo}
                </td>

                <td>
                  <StatusBadge status={project.status} />
                </td>

                <td className="text-gray-400">
                  {project.lastDeploy}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* DEPLOYMENT LOGS */}

      <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl">

        <h2 className="text-white text-lg font-medium mb-4">
          Deployment Logs
        </h2>

        <div className="bg-black p-4 rounded-lg text-sm font-mono text-green-400 space-y-1 h-40 overflow-y-auto">

          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}

        </div>

      </div>

    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status?: boolean;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-5 hover:border-green-500 transition">

      <h2 className="text-gray-400 text-sm">
        {title}
      </h2>

      <p
        className={`text-3xl font-semibold mt-1 ${
          status
            ? "text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <p className="text-white text-xl font-semibold mt-1">
        {value}
      </p>

    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    Running: "bg-green-900 text-green-400 border-green-500",
    Building: "bg-yellow-900 text-yellow-400 border-yellow-500",
    Failed: "bg-red-900 text-red-400 border-red-500",
  };

  return (
    <span
      className={`px-2 py-1 text-xs border rounded-md ${styles[status]}`}
    >
      {status}
    </span>
  );
}