import type { Request, Response } from "express"
import { randomUUID } from "crypto"
import { deploymentQueue } from "../queue/deployment.queue.js"
import { deploymentStore } from "../store/deployment.store.js"

export const deployProject = async (req: Request, res: Response) => {
  const { repo, branch } = req.body

  if (!repo || typeof repo !== "string" || repo.trim() === "") {
    res.status(400).json({
      status: "error",
      message: "Missing or invalid field: repo"
    })
    return
  }

  if (!branch || typeof branch !== "string" || branch.trim() === "") {
    res.status(400).json({
      status: "error",
      message: "Missing or invalid field: branch"
    })
    return
  }

  const deploymentId = randomUUID()

  deploymentStore.create({
    deploymentId,
    repo: repo.trim(),
    branch: branch.trim(),
    framework: "unknown",
    status: "QUEUED"
  })

  deploymentQueue.enqueue({
    deploymentId,
    repo: repo.trim(),
    branch: branch.trim()
  })

  // Return immediately — pipeline runs in background via queue
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
    res.status(404).json({
      status: "error",
      message: "Deployment not found"
    })
    return
  }

  res.json({
    status: "success",
    deployment
  })
}

export const getAllDeployments = (_req: Request, res: Response) => {
  const deployments = deploymentStore.getAll()

  res.json({
    status: "success",
    total: deployments.length,
    deployments
  })
}

export const getDeploymentLogs = (req: Request, res: Response) => {
  const id = req.params["id"] as string

  const deployment = deploymentStore.get(id)

  if (!deployment) {
    res.status(404).json({
      status: "error",
      message: "Deployment not found"
    })
    return
  }

  res.json({
    status: "success",
    deploymentId: id,
    total: deployment.logs.length,
    logs: deployment.logs
  })
}
