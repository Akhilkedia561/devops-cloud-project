import { runDeploymentPipeline } from "../services/pipeline.service.js";
export const deployProject = async (req, res) => {
    try {
        const { repo, branch } = req.body;
        const result = await runDeploymentPipeline(repo, branch);
        res.json({
            status: "success",
            deployment: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Deployment failed",
        });
    }
};
//# sourceMappingURL=deploy.controller.js.map