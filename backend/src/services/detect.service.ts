import fs from "fs";
import path from "path";

export const detectFramework = (projectPath: string) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  const requirementsPath = path.join(projectPath, "requirements.txt");
  const nextConfig = path.join(projectPath, "next.config.js");

  // Python project
  if (fs.existsSync(requirementsPath)) {
    return "python";
  }

  // Node based project
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8")
    );

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (deps?.next) {
      return "nextjs";
    }

    if (deps?.react) {
      return "react";
    }

    return "node";
  }

  return "unknown";
};