import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";

export const buildProject = async (
  projectPath: string,
  framework: string
) => {

  if (framework !== "node") {
    console.log("Non-node project detected, skipping npm install");
    return;
  }

  console.log("Installing dependencies...");

  await runCommand("npm install", projectPath);

  const packageJsonPath = path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log("No package.json found, skipping build step");
    return;
  }

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8")
  );

  if (packageJson?.scripts?.build) {
    console.log("Running project build...");
    await runCommand("npm run build", projectPath);
  } else {
    console.log("No build script found, skipping build step");
  }
};