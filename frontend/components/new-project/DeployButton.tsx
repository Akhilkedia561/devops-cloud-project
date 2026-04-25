"use client";

import { Rocket } from "lucide-react";
import { useState } from "react";

type Props = {
  disabled: boolean;
  onDeploy: () => Promise<void>;
};

export default function DeployButton({ disabled, onDeploy }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onDeploy();
    setLoading(false);
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Rocket size={16} />
        {loading ? "Deploying..." : "Deploy Project"}
      </button>
    </div>
  );
}