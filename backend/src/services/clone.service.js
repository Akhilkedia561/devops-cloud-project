import { simpleGit } from "simple-git";
import path from "path";
import { v4 as uuid } from "uuid";
import { DEPLOYMENTS_DIR } from "../config/paths.js";
export const cloneRepo = async (repo, branch) => {
    const deploymentId = uuid();
    const repoUrl = `https://github.com/${repo}.git`;
    const projectPath = path.join(DEPLOYMENTS_DIR, deploymentId);
    const git = simpleGit();
    await git.clone(repoUrl, projectPath, ["-b", branch]);
    return {
        deploymentId,
        projectPath,
    };
};
//# sourceMappingURL=clone.service.js.map