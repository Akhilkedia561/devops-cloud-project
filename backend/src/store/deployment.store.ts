export interface LogEntry {
  timestamp: string
  message: string
}

export interface Deployment {
  deploymentId: string
  repo: string
  branch: string
  framework: string
  status: string
  logs: LogEntry[]
}

type LogSubscriber = (message: string, status: string) => void

class DeploymentStore {
  private deployments: Map<string, Deployment> = new Map()
  private subscribers: Map<string, Set<LogSubscriber>> = new Map()

  create(deployment: Omit<Deployment, "logs">) {
    this.deployments.set(deployment.deploymentId, { ...deployment, logs: [] })
  }

  get(id: string) {
    return this.deployments.get(id)
  }

  update(id: string, data: Partial<Omit<Deployment, "logs">>) {
    const existing = this.deployments.get(id)
    if (!existing) return

    const updated = { ...existing, ...data }
    this.deployments.set(id, updated)
  }

  appendLog(id: string, message: string) {
    const existing = this.deployments.get(id)
    if (!existing) return

    existing.logs.push({
      timestamp: new Date().toISOString(),
      message
    })

    // Notify all subscribers for this deployment
    const subs = this.subscribers.get(id)
    if (subs) {
      for (const sub of subs) {
        sub(message, existing.status)
      }
    }
  }

  subscribe(id: string, subscriber: LogSubscriber): () => void {
    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, new Set())
    }

    this.subscribers.get(id)!.add(subscriber)

    // Returns unsubscribe function
    return () => {
      this.subscribers.get(id)?.delete(subscriber)
    }
  }

  getAll() {
    return Array.from(this.deployments.values())
  }
}

export const deploymentStore = new DeploymentStore()