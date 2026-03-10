import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {

  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      repoUrl: body.repoUrl,
      branch: body.branch || "main"
    }
  });

  return NextResponse.json(project);
}