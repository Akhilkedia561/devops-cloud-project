import fs from "fs"
import { cloneRepo } from "./clone.service.js"
import { detectFramework } from "./detect.service.js"
import { buildProject } from "./build.service.js"
import { archiveRepo } from "./archive.service.js"
import { deploymentStore } from "../store/deployment.store.js"
import { saveDeploymentPath, saveArchivePath } from "../db/database.js"

const log = (deploymentId: string, message: string) => {
  console.log(message)
  deploymentStore.appendLog(deploymentId, message)
}

export const runDeploymentPipeline = async (
  repo: string,
  branch: string,
  deploymentId: string
) => {
  const deployment = deploymentStore.get(deploymentId)

  if (!deployment) {
    throw new Error("Deployment not found")
  }

  try {
    log(deploymentId, "Cloning repository...")
    deploymentStore.update(deploymentId, { status: "CLONING" })

    const { projectPath } = await cloneRepo(repo, branch, deploymentId)
    saveDeploymentPath(deploymentId, projectPath)
    log(deploymentId, `Repository cloned to ${projectPath}`)

    log(deploymentId, "Archiving source code...")
    const archivePath = await archiveRepo(projectPath, deploymentId)
    saveArchivePath(deploymentId, archivePath)
    log(deploymentId, `Source archived at ${archivePath}`)

    // Cleanup cloned folder — archive is all we need from here
    fs.rmSync(projectPath, { recursive: true, force: true })
    log(deploymentId, "Cleaned up cloned source.")

    log(deploymentId, "Detecting framework...")
    const framework = detectFramework(projectPath)
    deploymentStore.update(deploymentId, { framework })
    log(deploymentId, `Framework detected: ${framework}`)

    log(deploymentId, "Installing dependencies and building...")
    deploymentStore.update(deploymentId, { status: "BUILDING" })

    await buildProject(projectPath, framework)

    log(deploymentId, "Build complete. Awaiting Docker step.")
    deploymentStore.update(deploymentId, { status: "SUCCESS" })

    return {
      deploymentId,
      framework,
      image: "pending-ci-build",
      status: "SUCCESS"
    }

  } catch (error: any) {
    const message = error?.message || "Unknown error during deployment"
    log(deploymentId, `Deployment failed: ${message}`)
    deploymentStore.update(deploymentId, { status: "FAILED" })
    throw error
  }
}