import { runDeploymentPipeline } from "../services/pipeline.service.js"
import { deploymentStore } from "../store/deployment.store.js"

interface QueueJob {
  deploymentId: string
  repo: string
  branch: string
}

class DeploymentQueue {
  private queue: QueueJob[] = []
  private isProcessing: boolean = false

  enqueue(job: QueueJob) {
    this.queue.push(job)
    console.log(`Job queued: ${job.deploymentId} (queue size: ${this.queue.length})`)
    this.process()
  }

  private async process() {
    if (this.isProcessing) return
    if (this.queue.length === 0) return

    this.isProcessing = true

    const job = this.queue.shift()!

    console.log(`Processing job: ${job.deploymentId}`)

    try {
      await runDeploymentPipeline(job.repo, job.branch, job.deploymentId)
    } catch (error: any) {
      console.error(`Job failed: ${job.deploymentId} — ${error?.message}`)
      deploymentStore.update(job.deploymentId, { status: "FAILED" })
    } finally {
      this.isProcessing = false
      console.log(`Job done: ${job.deploymentId}`)
      this.process()
    }
  }

  getStatus() {
    return {
      isProcessing: this.isProcessing,
      queued: this.queue.length,
      jobs: this.queue.map(j => j.deploymentId)
    }
  }
}

export const deploymentQueue = new DeploymentQueue()