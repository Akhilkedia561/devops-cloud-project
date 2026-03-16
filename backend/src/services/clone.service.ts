import { simpleGit } from "simple-git"
import path from "path"
import { DEPLOYMENTS_DIR } from "../config/paths.js"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const cloneRepo = async (
  repo: string,
  branch: string,
  deploymentId: string
) => {
  const repoUrl = `https://github.com/${repo}.git`
  const projectPath = path.join(DEPLOYMENTS_DIR, deploymentId)

  let lastError: unknown

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Clone attempt ${attempt}/${MAX_RETRIES}...`)

      const git = simpleGit()

      await git.clone(repoUrl, projectPath, ["-b", branch])

      console.log("Clone successful.")

      return { projectPath }

    } catch (error) {
      lastError = error
      console.warn(`Clone attempt ${attempt} failed. ${attempt < MAX_RETRIES ? `Retrying in ${RETRY_DELAY_MS / 1000}s...` : "No more retries."}`)

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS)
      }
    }
  }

  throw new Error(`Failed to clone repository after ${MAX_RETRIES} attempts: ${lastError}`)
}