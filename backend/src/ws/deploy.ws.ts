import { WebSocketServer, WebSocket } from "ws"
import { IncomingMessage } from "http"
import { Server } from "http"
import { deploymentStore } from "../store/deployment.store.js"

export const initDeployWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ noServer: true })

  // Intercept HTTP upgrade requests and route WebSocket manually
  server.on("upgrade", (req: IncomingMessage, socket, head) => {
    const url = req.url ?? ""

    if (!url.startsWith("/ws/deploy/")) {
      socket.destroy()
      return
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req)
    })
  })

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = req.url ?? ""
    const deploymentId = url.split("/ws/deploy/")[1]

    if (!deploymentId) {
      ws.send(JSON.stringify({ type: "error", message: "Missing deploymentId" }))
      ws.close()
      return
    }

    const deployment = deploymentStore.get(deploymentId)

    if (!deployment) {
      ws.send(JSON.stringify({ type: "error", message: "Deployment not found" }))
      ws.close()
      return
    }

    // Send all existing logs immediately on connect
    for (const log of deployment.logs) {
      ws.send(JSON.stringify({ type: "log", ...log }))
    }

    // If already finished, close immediately
    if (deployment.status === "SUCCESS" || deployment.status === "FAILED") {
      ws.send(JSON.stringify({ type: "done", status: deployment.status }))
      ws.close()
      return
    }

    // Subscribe to new logs
    const unsubscribe = deploymentStore.subscribe(deploymentId, (message, status) => {
      if (ws.readyState !== WebSocket.OPEN) return

      ws.send(JSON.stringify({
        type: "log",
        timestamp: new Date().toISOString(),
        message
      }))

      if (status === "SUCCESS" || status === "FAILED") {
        ws.send(JSON.stringify({ type: "done", status }))
        ws.close()
        unsubscribe()
      }
    })

    ws.on("close", () => {
      unsubscribe()
    })
  })
}