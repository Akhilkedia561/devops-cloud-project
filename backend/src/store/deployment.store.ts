import db from "../db/database.js"

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
  envVars: Record<string, string>
  createdAt: string
}

type LogSubscriber = (message: string, status: string) => void

class DeploymentStore {
  private subscribers: Map<string, Set<LogSubscriber>> = new Map()

  create(deployment: Omit<Deployment, "logs" | "createdAt" | "envVars"> & { envVars?: Record<string, string> }) {
    db.prepare(`
      INSERT INTO deployments (deploymentId, repo, branch, framework, status, logs, envVars, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      deployment.deploymentId,
      deployment.repo,
      deployment.branch,
      deployment.framework,
      deployment.status,
      JSON.stringify([]),
      JSON.stringify(deployment.envVars ?? {}),
      new Date().toISOString()
    )
  }

  get(id: string): Deployment | undefined {
    const row = db.prepare(`SELECT * FROM deployments WHERE deploymentId = ?`)
      .get(id) as any
    if (!row) return undefined
    return {
      ...row,
      logs: JSON.parse(row.logs),
      envVars: JSON.parse(row.envVars ?? "{}")
    }
  }

  update(id: string, data: Partial<Omit<Deployment, "logs" | "createdAt">>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ")
    const values = Object.values(data)
    db.prepare(`UPDATE deployments SET ${fields} WHERE deploymentId = ?`)
      .run(...values, id)

    if (data.status) {
      this.notifySubscribers(id, null, data.status)
    }
  }

  appendLog(id: string, message: string) {
    const row = db.prepare(`SELECT logs, status FROM deployments WHERE deploymentId = ?`)
      .get(id) as any
    if (!row) return

    const logs: LogEntry[] = JSON.parse(row.logs)
    logs.push({ timestamp: new Date().toISOString(), message })

    db.prepare(`UPDATE deployments SET logs = ? WHERE deploymentId = ?`)
      .run(JSON.stringify(logs), id)

    const current = db.prepare(`SELECT status FROM deployments WHERE deploymentId = ?`)
      .get(id) as any

    this.notifySubscribers(id, message, current?.status ?? row.status)
  }

  private notifySubscribers(id: string, message: string | null, status: string) {
    const subs = this.subscribers.get(id)
    if (!subs) return
    for (const sub of subs) {
      sub(message ?? "", status)
    }
  }

  subscribe(id: string, subscriber: LogSubscriber): () => void {
    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, new Set())
    }
    this.subscribers.get(id)!.add(subscriber)
    return () => {
      this.subscribers.get(id)?.delete(subscriber)
    }
  }

  getAll(): Deployment[] {
    const rows = db.prepare(`SELECT * FROM deployments ORDER BY createdAt DESC`).all() as any[]
    return rows.map(row => ({
      ...row,
      logs: JSON.parse(row.logs),
      envVars: JSON.parse(row.envVars ?? "{}")
    }))
  }
}

export const deploymentStore = new DeploymentStore()