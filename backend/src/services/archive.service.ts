import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import { STORAGE_DIR } from "../config/paths.js"

const execAsync = promisify(exec)

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true })
}

export const archiveRepo = async (
  projectPath: string,
  deploymentId: string
): Promise<string> => {
  const archivePath = path.join(STORAGE_DIR, `${deploymentId}.tar.gz`)

  // Redeploy safety — remove existing archive if present
  if (fs.existsSync(archivePath)) {
    fs.unlinkSync(archivePath)
    console.log(`Removed existing archive for ${deploymentId}`)
  }

  await execAsync(`tar -czf "${archivePath}" -C "${projectPath}" .`)
  console.log(`Archive created at ${archivePath}`)
  return archivePath
}

export const extractArchive = async (
  deploymentId: string,
  extractTo: string
): Promise<void> => {
  const archivePath = path.join(STORAGE_DIR, `${deploymentId}.tar.gz`)

  if (!fs.existsSync(archivePath)) {
    throw new Error(`Archive not found for deploymentId: ${deploymentId}`)
  }

  fs.mkdirSync(extractTo, { recursive: true })
  await execAsync(`tar -xzf "${archivePath}" -C "${extractTo}"`)
  console.log(`Archive extracted to ${extractTo}`)
}