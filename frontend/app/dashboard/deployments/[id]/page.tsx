"use client";

import DeploymentHeader from "@/components/deployment/DeploymentHeader";
import PipelineStages from "@/components/deployment/PipelineStages";
import LogsViewer from "@/components/deployment/LogsViewer";
import DeploymentInfo from "@/components/deployment/DeploymentInfo";

export default function DeploymentPage() {
  return (
    <div className="p-8 space-y-6">

      <DeploymentHeader project="—" branch="—" status="BUILDING" />

      <PipelineStages status="BUILDING" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <LogsViewer logs={[]} />
        </div>

        <DeploymentInfo deploymentId="—" framework="—" status="BUILDING" />
      </div>

    </div>
  );
}