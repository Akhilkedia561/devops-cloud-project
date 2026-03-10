"use client";

import { Github, Search, Lock, Globe } from "lucide-react";
import { useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  updated_at: string;
};

export default function RepoInput() {

  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const perPage = 6;

  /* ---------------- FETCH REPOS ---------------- */

  useEffect(() => {

    fetch("/api/github/repos")

      .then((res) => res.json())

      .then((data) => {

        if (Array.isArray(data)) {

          setRepos(data);
          setFilteredRepos(data);

        } else {

          console.error("GitHub repo API error:", data);

          setRepos([]);
          setFilteredRepos([]);

        }

        setLoading(false);

      })

      .catch((err) => {

        console.error("Failed to fetch repos:", err);

        setRepos([]);
        setFilteredRepos([]);
        setLoading(false);

      });

  }, []);

  /* ---------------- SEARCH FILTER ---------------- */

  useEffect(() => {

    const filtered = repos.filter((repo) =>
      repo.full_name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredRepos(filtered);
    setPage(1);

  }, [search, repos]);

  /* ---------------- PAGINATION ---------------- */

  const start = (page - 1) * perPage;

  const paginatedRepos = Array.isArray(filteredRepos)
    ? filteredRepos.slice(start, start + perPage)
    : [];

  const totalPages = Math.ceil(filteredRepos.length / perPage);

  /* ---------------- UI ---------------- */

  return (

    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 backdrop-blur space-y-6">

      {/* HEADER */}

      <div className="flex items-center gap-2">

        <Github size={18} />

        <h2 className="text-lg font-medium">
          Select Repository
        </h2>

      </div>

      {/* SEARCH */}

      <div className="relative">

        <Search
          size={16}
          className="absolute left-3 top-3 text-gray-500"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />

      </div>

      {/* LOADING */}

      {loading && (

        <p className="text-gray-400 text-sm">
          Loading repositories...
        </p>

      )}

      {/* EMPTY STATE */}

      {!loading && filteredRepos.length === 0 && (

        <p className="text-gray-500 text-sm">
          No repositories found
        </p>

      )}

      {/* REPO GRID */}

      <div className="grid md:grid-cols-2 gap-3">

        {paginatedRepos.map((repo) => (

          <div
            key={repo.id}
            onClick={() => setSelectedRepo(repo.full_name)}
            className={`p-4 rounded-lg border cursor-pointer transition
            ${
              selectedRepo === repo.full_name
                ? "border-blue-500 bg-zinc-800"
                : "border-zinc-800 hover:bg-zinc-800"
            }`}
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="font-medium text-sm">
                  {repo.name}
                </p>

                <p className="text-xs text-gray-500">
                  {repo.full_name}
                </p>

              </div>

              {/* PRIVATE / PUBLIC BADGE */}

              <span
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md
                ${
                  repo.private
                    ? "bg-red-900/30 text-red-400"
                    : "bg-green-900/30 text-green-400"
                }`}
              >

                {repo.private ? (
                  <Lock size={12} />
                ) : (
                  <Globe size={12} />
                )}

                {repo.private ? "Private" : "Public"}

              </span>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </p>

          </div>

        ))}

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-between items-center text-sm text-gray-400">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-800 disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-800 disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

      {/* SELECTED REPO */}

      {selectedRepo && (

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm">

          Selected Repository:

          <span className="text-blue-400 ml-2">
            {selectedRepo}
          </span>

        </div>

      )}

    </div>

  );

}