"use client";

import { GitBranch } from "lucide-react";
import { useState } from "react";

export default function BranchSelector() {
  const [branch, setBranch] = useState("main");

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={18} />
        <h2 className="text-lg font-medium">Branch</h2>
      </div>

      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white"
      >
        <option value="main">main</option>
        <option value="dev">dev</option>
        <option value="staging">staging</option>
      </select>

      <p className="text-xs text-gray-500 mt-2">
        ShipStack will deploy this branch.
      </p>
    </div>
  );
}