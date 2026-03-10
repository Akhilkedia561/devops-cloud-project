"use client";

import Link from "next/link";

type Project = {
  id: string;
  name: string;
  repoUrl: string;
  branch: string;
  status: string;
};

export default function ProjectCard({ project }: { project: Project }) {

  return (

    <Link
      href={`/dashboard/projects/${project.id}`}
      className="block rounded-xl border border-white/10 bg-white/5 p-6 hover:border-purple-400 transition"
    >

      <h3 className="text-lg font-semibold">
        {project.name}
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        {project.repoUrl}
      </p>

      <div className="flex items-center justify-between mt-4 text-sm">

        <span className="text-gray-400">
          Branch: {project.branch}
        </span>

        <span
          className={`
            px-2 py-1 rounded text-xs
            ${project.status === "live" ? "bg-green-500/20 text-green-400" : ""}
            ${project.status === "building" ? "bg-yellow-500/20 text-yellow-400" : ""}
            ${project.status === "failed" ? "bg-red-500/20 text-red-400" : ""}
          `}
        >
          {project.status}
        </span>

      </div>

    </Link>
  );
}