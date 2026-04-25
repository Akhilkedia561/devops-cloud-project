import fs from "fs";
import path from "path";

export const detectFramework = (projectPath: string) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  const requirementsPath = path.join(projectPath, "requirements.txt");

  // Python project
  if (fs.existsSync(requirementsPath)) {
    return "python";
  }

  // Node based project
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check next.config.* first (more reliable than deps)
    const hasNextConfig =
      fs.existsSync(path.join(projectPath, "next.config.js")) ||
      fs.existsSync(path.join(projectPath, "next.config.ts")) ||
      fs.existsSync(path.join(projectPath, "next.config.mjs"));

    if (hasNextConfig || deps?.next) {
      return "nextjs";
    }

    if (deps?.["react-scripts"] || fs.existsSync(path.join(projectPath, "public/index.html"))) {
      return "react";
    }

    if (deps?.react) {
      return "react";
    }

    if (deps?.express || deps?.fastify || deps?.koa) {
      return "node";
    }

    return "node"; // has package.json but no known framework = generic node
  }

  return "unknown";
};