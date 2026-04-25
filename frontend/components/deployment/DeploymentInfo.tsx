"use client";

interface DeploymentInfoProps {
  deploymentId: string;
  framework: string;
  status: string;
}

export default function DeploymentInfo({
  deploymentId,
  framework,
  status,
}: DeploymentInfoProps) {
  const info = [
    { label: "Status", value: status },
    { label: "Framework", value: framework },
    { label: "Deployment ID", value: deploymentId.slice(0, 8) },
    { label: "Image", value: "pending-ci-build" },
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <h2 className="text-lg font-medium text-white mb-4">
        Deployment Info
      </h2>

      <div className="space-y-3 text-sm">
        {info.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-400">
            <span>{item.label}</span>
            <span className="text-white font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}