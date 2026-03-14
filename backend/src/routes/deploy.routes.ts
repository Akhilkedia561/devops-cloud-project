import { Router } from "express";
import { deployProject } from "../controllers/deploy.controller.js";

const router = Router();

router.post("/", deployProject);

export default router;