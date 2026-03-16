import { Router } from "express"
import {
  deployProject,
  getDeployment,
  getAllDeployments,
  getDeploymentLogs
} from "../controllers/deploy.controller.js"

const router = Router()

router.post("/", deployProject)
router.get("/", getAllDeployments)
router.get("/:id", getDeployment)
router.get("/:id/logs", getDeploymentLogs)

export default router