import express from "express";
import { deployments } from "../utils/deployments.store.js";

const router = express.Router();

router.get("/:id", (req, res) => {

  const deployment = deployments[req.params.id];

  if (!deployment) {
    return res.status(404).json({
      error: "Deployment not found"
    });
  }

  res.json(deployment);
});

export default router;