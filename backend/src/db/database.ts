import Database from "better-sqlite3"
import type { Database as DatabaseType } from "better-sqlite3"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_PATH = path.join(__dirname, "../../shipstack.db")

const db: DatabaseType = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS deployments (
    deploymentId TEXT PRIMARY KEY,
    repo TEXT NOT NULL,
    branch TEXT NOT NULL,
    framework TEXT NOT NULL,
    status TEXT NOT NULL,
    logs TEXT NOT NULL DEFAULT '[]',
    localPath TEXT,
    archivePath TEXT,
    envVars TEXT NOT NULL DEFAULT '{}',
    createdAt TEXT NOT NULL
  )
`)

// Migrations
try { db.exec(`ALTER TABLE deployments ADD COLUMN localPath TEXT`) } catch (_) {}
try { db.exec(`ALTER TABLE deployments ADD COLUMN archivePath TEXT`) } catch (_) {}
try { db.exec(`ALTER TABLE deployments ADD COLUMN envVars TEXT NOT NULL DEFAULT '{}'`) } catch (_) {}

export const saveDeploymentPath = (deploymentId: string, localPath: string): void => {
  db.prepare(`UPDATE deployments SET localPath = ? WHERE deploymentId = ?`)
    .run(localPath, deploymentId)
}

export const saveArchivePath = (deploymentId: string, archivePath: string): void => {
  db.prepare(`UPDATE deployments SET archivePath = ? WHERE deploymentId = ?`)
    .run(archivePath, deploymentId)
}

export const getDeploymentPath = (deploymentId: string): string | null => {
  const row = db.prepare(`SELECT localPath FROM deployments WHERE deploymentId = ?`)
    .get(deploymentId) as { localPath: string | null } | undefined
  return row?.localPath ?? null
}

export const getArchivePath = (deploymentId: string): string | null => {
  const row = db.prepare(`SELECT archivePath FROM deployments WHERE deploymentId = ?`)
    .get(deploymentId) as { archivePath: string | null } | undefined
  return row?.archivePath ?? null
}

export const saveEnvVars = (
  deploymentId: string,
  envVars: Record<string, string>
): void => {
  db.prepare(`UPDATE deployments SET envVars = ? WHERE deploymentId = ?`)
    .run(JSON.stringify(envVars), deploymentId)
}

export const getEnvVars = (deploymentId: string): Record<string, string> => {
  const row = db.prepare(`SELECT envVars FROM deployments WHERE deploymentId = ?`)
    .get(deploymentId) as { envVars: string } | undefined
  return row ? JSON.parse(row.envVars) : {}
}

export default db