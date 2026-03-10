"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  name: string;
  repoUrl: string;
  branch: string;
  status: string;
};

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });

  }, []);

  return (

    <div className="p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl font-bold">
          Projects
        </h1>

        <button
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm"
        >
          + New Project
        </button>

      </div>

      {loading && (
        <p className="text-gray-400">
          Loading projects...
        </p>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-gray-400">
          No projects yet.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}

      </div>

    </div>
  );
}
