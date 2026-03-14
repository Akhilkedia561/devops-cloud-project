import fs from "fs";
import path from "path";

export const detectFramework = (projectPath: string) => {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return "unknown";
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (deps.next) return "nextjs";
  if (deps.react) return "react";
  if (deps.express) return "node";

  return "node";
};