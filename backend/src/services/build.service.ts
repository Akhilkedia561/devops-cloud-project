import { runCommand } from "../utils/exec.js";

export const buildProject = async (projectPath: string) => {
  await runCommand("npm install", projectPath);

  try {
    await runCommand("npm run build", projectPath);
  } catch {
    console.log("No build script found");
  }
};