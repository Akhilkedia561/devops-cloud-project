import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"

import deployRoutes from "./routes/deploy.routes.js"
import deploymentRoutes from "./routes/deployment.routes.js"
import { initDeployWebSocket } from "./ws/deploy.ws.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "http://localhost:3000"
}))

app.use(express.json())

app.use("/api/deploy", deployRoutes)
app.use("/api/deployments", deploymentRoutes)

const PORT = process.env.PORT || 5000

const server = createServer(app)

initDeployWebSocket(server)

server.listen(PORT, () => {
  console.log(`ShipStack backend running on port ${PORT}`)
})

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err)
})

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err)
})