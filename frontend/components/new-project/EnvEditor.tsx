"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface EnvVar {
  key: string;
  value: string;
}

export default function EnvEditor() {
  const [vars, setVars] = useState<EnvVar[]>([]);

  const addVar = () => {
    setVars([...vars, { key: "", value: "" }]);
  };

  const updateVar = (index: number, field: keyof EnvVar, val: string) => {
    const newVars = [...vars];
    newVars[index][field] = val;
    setVars(newVars);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Environment Variables</h2>

        <button
          onClick={addVar}
          className="flex items-center gap-1 text-sm text-blue-400"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-3">
        {vars.map((v, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <input
              placeholder="KEY"
              value={v.key}
              onChange={(e) => updateVar(i, "key", e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
            />

            <input
              placeholder="VALUE"
              value={v.value}
              onChange={(e) => updateVar(i, "value", e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}