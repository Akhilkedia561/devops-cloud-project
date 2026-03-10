"use client";

export default function DeploymentInfo() {
  const info = [
    { label: "Status", value: "Building" },
    { label: "Region", value: "us-east-1" },
    { label: "Duration", value: "1m 24s" },
    { label: "Container ID", value: "a8f2c91" },
    { label: "Image", value: "shipstack:latest" },
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <h2 className="text-lg font-medium text-white mb-4">
        Deployment Info
      </h2>

      <div className="space-y-3 text-sm">
        {info.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-gray-400"
          >
            <span>{item.label}</span>
            <span className="text-white font-mono">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}