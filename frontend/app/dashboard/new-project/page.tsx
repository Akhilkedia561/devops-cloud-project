"use client";

import RepoInput from "@/components/new-project/RepoInput";
import BranchSelector from "@/components/new-project/BranchSelector";
import EnvEditor from "@/components/new-project/EnvEditor";
import BuildConfig from "@/components/new-project/BuildConfig";
import DeployButton from "@/components/new-project/DeployButton";

export default function NewProjectPage() {
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

      <RepoInput />

      <BranchSelector />

      <BuildConfig />

      <EnvEditor />

      <DeployButton />
    </div>
  );
}