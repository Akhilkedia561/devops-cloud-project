export interface Deployment {
  deploymentId: string;
  repo: string;
  branch: string;
  framework: string;
  status: string;
}

export const deployments: Record<string, Deployment> = {};