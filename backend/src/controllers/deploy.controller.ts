import type { Request, Response } from "express"
import { randomUUID } from "crypto"
import { deploymentQueue } from "../queue/deployment.queue.js"
import { deploymentStore } from "../store/deployment.store.js"
import { saveEnvVars } from "../db/database.js"

export const deployProject = async (req: Request, res: Response) => {
  const { repo, branch, envVars } = req.body

  if (!repo || typeof repo !== "string" || repo.trim() === "") {
    res.status(400).json({ status: "error", message: "Missing or invalid field: repo" })
    return
  }

  if (!branch || typeof branch !== "string" || branch.trim() === "") {
    res.status(400).json({ status: "error", message: "Missing or invalid field: branch" })
    return
  }

  // Validate envVars if provided
  if (envVars !== undefined && (typeof envVars !== "object" || Array.isArray(envVars))) {
    res.status(400).json({ status: "error", message: "envVars must be a key-value object" })
    return
  }

  const deploymentId = randomUUID()
  const sanitizedEnvVars: Record<string, string> = {}

  // Sanitize — ensure all values are strings
  if (envVars) {
    for (const [key, value] of Object.entries(envVars)) {
      sanitizedEnvVars[key.trim()] = String(value)
    }
  }

  deploymentStore.create({
    deploymentId,
    repo: repo.trim(),
    branch: branch.trim(),
    framework: "unknown",
    status: "QUEUED",
    envVars: sanitizedEnvVars
  })

  // Persist env vars to DB
  if (Object.keys(sanitizedEnvVars).length > 0) {
    saveEnvVars(deploymentId, sanitizedEnvVars)
  }

  deploymentQueue.enqueue({
    deploymentId,
    repo: repo.trim(),
    branch: branch.trim()
  })

  res.json({
    status: "queued",
    deploymentId,
    message: "Deployment queued. Track status via GET /api/deploy/:id or WS /ws/deploy/:id"
  })
}

export const getDeployment = (req: Request, res: Response) => {
  const id = req.params["id"] as string
  const deployment = deploymentStore.get(id)

  if (!deployment) {
    res.status(404).json({ status: "error", message: "Deployment not found" })
    return
  }

  res.json({ status: "success", deployment })
}

export const getAllDeployments = (_req: Request, res: Response) => {
  const deployments = deploymentStore.getAll()
  res.json({ status: "success", total: deployments.length, deployments })
}

export const getDeploymentLogs = (req: Request, res: Response) => {
  const id = req.params["id"] as string
  const deployment = deploymentStore.get(id)

  if (!deployment) {
    res.status(404).json({ status: "error", message: "Deployment not found" })
    return
  }

  res.json({
    status: "success",
    deploymentId: id,
    total: deployment.logs.length,
    logs: deployment.logs
  })
}