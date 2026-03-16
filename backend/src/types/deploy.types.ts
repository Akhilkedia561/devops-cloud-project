export interface DeployRequest {
  repo: string;
  branch: string;
}

export type DeploymentStatus =
  | "QUEUED"
  | "CLONING"
  | "INSTALLING"
  | "BUILDING"
  | "DEPLOYING"
  | "SUCCESS"
  | "FAILED";