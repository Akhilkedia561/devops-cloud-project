"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import DeploymentHeader from "@/components/deployment/DeploymentHeader";
import DeploymentInfo from "@/components/deployment/DeploymentInfo";
import LogsViewer from "@/components/deployment/LogsViewer";
import PipelineStages from "@/components/deployment/PipelineStages";

type LogEntry = {
  timestamp: string;
  message: string;
};

type Deployment = {
  deploymentId: string;
  repo: string;
  branch: string;
  framework: string;
  status: string;
  logs: LogEntry[];
};

export default function ProjectPage() {
  const { id } = useParams();
  const deploymentId = Array.isArray(id) ? id[0] : id;

  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial deployment state
  useEffect(() => {
    if (!deploymentId) return;

    const fetchDeployment = async () => {
      try {
        const res = await fetch(`/backend/api/deploy/${deploymentId}`);
        const data = await res.json();

        if (data.status === "success") {
          setDeployment(data.deployment);
          setLogs(data.deployment.logs ?? []);
        } else {
          setError("Deployment not found");
        }
      } catch {
        setError("Failed to fetch deployment");
      }
    };

    fetchDeployment();
  }, [deploymentId]);

  // Connect WebSocket for live logs
  useEffect(() => {
    if (!deploymentId) return;

    const ws = new WebSocket(
      `ws://localhost:5000/ws/deploy/${deploymentId}`
    );

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "log") {
        setLogs((prev) => [
          ...prev,
          { timestamp: data.timestamp, message: data.message },
        ]);
      }

      if (data.type === "done") {
        setDeployment((prev) =>
          prev ? { ...prev, status: data.status } : prev
        );
      }

      // Only show WS errors as UI errors, not connection close
      if (data.type === "error") {
        console.warn("WS error message:", data.message);
      }
    };

    ws.onerror = (e) => {
      // Log but don't crash UI — deployment may already be done
      console.warn("WebSocket error:", e);
    };

    return () => {
      ws.close();
    };
  }, [deploymentId]);

  if (error) {
    return (
      <div className="p-8 text-red-400 text-sm">
        Error: {error}
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="p-8 text-gray-400 text-sm">
        Loading deployment...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <DeploymentHeader
        project={deployment.repo}
        branch={deployment.branch}
        status={deployment.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LogsViewer logs={logs} />
        </div>

        <div className="space-y-6">
          <PipelineStages status={deployment.status} />
          <DeploymentInfo
            deploymentId={deployment.deploymentId}
            framework={deployment.framework}
            status={deployment.status}
          />
        </div>
      </div>
    </div>
  );
}