import { NextResponse } from "next/server"

let projects: any[] = []

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(req: Request) {

  const body = await req.json()

  const project = {
    id: Date.now(),
    name: body.name,
    repoUrl: body.repoUrl,
    branch: body.branch || "main"
  }

  projects.push(project)

  return NextResponse.json(project)
}
