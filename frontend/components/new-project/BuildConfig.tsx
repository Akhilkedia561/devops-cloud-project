"use client";

import { Wrench } from "lucide-react";
import { useState } from "react";

export default function BuildConfig() {
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [outputDir, setOutputDir] = useState(".next");

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur space-y-4">
      <div className="flex items-center gap-2">
        <Wrench size={18} />
        <h2 className="text-lg font-medium">Build Configuration</h2>
      </div>

      <div>
        <label className="text-sm text-gray-400">Build Command</label>
        <input
          value={buildCommand}
          onChange={(e) => setBuildCommand(e.target.value)}
          className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">Output Directory</label>
        <input
          value={outputDir}
          onChange={(e) => setOutputDir(e.target.value)}
          className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white"
        />
      </div>
    </div>
  );
}