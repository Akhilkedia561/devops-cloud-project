"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RepoInput from "@/components/new-project/RepoInput";
import BranchSelector from "@/components/new-project/BranchSelector";
import EnvEditor from "@/components/new-project/EnvEditor";
import BuildConfig from "@/components/new-project/BuildConfig";
import DeployButton from "@/components/new-project/DeployButton";

export default function NewProjectPage() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [branch, setBranch] = useState("main");
  const router = useRouter();

  const handleDeploy = async () => {
    if (!selectedRepo) return;

    const res = await fetch("/backend/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: selectedRepo, branch })
    });

    const data = await res.json();

    if (data.deploymentId) {
      router.push(`/projects/${data.deploymentId}`);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Import Project
        </h1>
        <p className="text-gray-400 mt-1">
          Deploy a new project from a Git repository
        </p>
      </div>

      <RepoInput
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
      />

      <BranchSelector
        branch={branch}
        onBranchChange={setBranch}
      />

      <BuildConfig />

      <EnvEditor />

      <DeployButton
        disabled={!selectedRepo}
        onDeploy={handleDeploy}
      />
    </div>
  );
}