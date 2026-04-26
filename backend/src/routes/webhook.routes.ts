import { Router } from "express"
import type { Request, Response } from "express"
import crypto from "crypto"
import http from "http"

const router = Router()

function triggerJenkins() {
  const token = process.env.JENKINS_TOKEN || ""
  const jobName = "shipstack-pipeline"

  const options = {
    hostname: "shipstack-jenkins",
    port: 8080,
    path: `/job/${jobName}/build`,
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`admin:${token}`).toString("base64"),
      "Content-Type": "application/json"
    }
  }

  const req = http.request(options, (res) => {
    console.log(`Jenkins trigger status: ${res.statusCode}`)
  })

  req.on("error", (err) => {
    console.error("Jenkins trigger failed:", err.message)
  })

  req.end()
}

router.post("/", (req: Request, res: Response) => {
  const sig = req.headers["x-hub-signature-256"] as string
  const secret = process.env.GITHUB_WEBHOOK_SECRET || ""
  const payload = JSON.stringify(req.body)
  const hmac = crypto.createHmac("sha256", secret)
  const digest = "sha256=" + hmac.update(payload).digest("hex")

  if (!sig || sig !== digest) {
    console.warn("Webhook signature mismatch — rejected")
    return res.status(401).json({ error: "Invalid signature" })
  }

  const event = req.headers["x-github-event"]

  if (event === "push") {
    const branch = req.body.ref?.replace("refs/heads/", "")
    const repo = req.body.repository?.full_name
    console.log(`Push event received — repo: ${repo}, branch: ${branch}`)
    triggerJenkins()
  }

  res.status(200).json({ received: true })
})

export default router