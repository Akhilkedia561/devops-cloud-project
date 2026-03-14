{
  "watch": ["src"],
  "ignore": ["deployments", "node_modules"],
  "ext": "ts",
  "exec": "node --loader ts-node/esm src/server.ts"
}
