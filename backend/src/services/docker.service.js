import { runCommand } from "../utils/exec.js";
export const dockerizeProject = async (projectPath, deploymentId) => {
    const imageName = `shipstack-${deploymentId}`;
    await runCommand(`docker build -t ${imageName} .`, projectPath);
    await runCommand(`docker run -d -p 0:3000 ${imageName}`);
    return imageName;
};
//# sourceMappingURL=docker.service.js.map