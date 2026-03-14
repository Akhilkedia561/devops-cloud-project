import { cloneRepo } from "./clone.service.js";
import { detectFramework } from "./detect.service.js";
import { buildProject } from "./build.service.js";
import { dockerizeProject } from "./docker.service.js";
export const runDeploymentPipeline = async (repo, branch) => {
    console.log("Cloning repository...");
    const { deploymentId, projectPath } = await cloneRepo(repo, branch);
    console.log("Detecting framework...");
    const framework = detectFramework(projectPath);
    console.log("Framework detected:", framework);
    console.log("Installing dependencies and building...");
    await buildProject(projectPath);
    console.log("Creating Docker container...");
    const image = await dockerizeProject(projectPath, deploymentId);
    return {
        deploymentId,
        framework,
        image,
    };
};
//# sourceMappingURL=pipeline.service.js.map