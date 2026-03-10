"use client";

import { Rocket } from "lucide-react";

export default function DeployButton() {
  const deploy = async () => {
    console.log("Trigger deployment");
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={deploy}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium"
      >
        <Rocket size={16} />
        Deploy Project
      </button>
    </div>
  );
}