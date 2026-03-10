"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

import {
  Rocket,
  GitBranch,
  Server,
  Activity,
  RotateCcw,
  Boxes
} from "lucide-react";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {

  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (

    <main className="bg-black text-white min-h-screen p-6">

      <div className="rounded-[28px] border border-white/10 overflow-hidden bg-black relative">

        <Navbar />

        {/* AUTH SECTION */}

        <div className="absolute top-6 right-8 z-50 flex items-center gap-4">

          {!isSignedIn ? (

            <Link
              href="/sign-in"
              className="bg-green-500 text-black px-5 py-2 rounded-lg font-medium hover:bg-green-400 transition shadow-lg shadow-green-500/20"
            >
              Sign in with GitHub
            </Link>

          ) : (

            <div className="flex items-center gap-4">

              <Link
                href="/dashboard"
                className="bg-green-500 text-black px-5 py-2 rounded-lg font-medium hover:bg-green-400 transition shadow-lg shadow-green-500/20"
              >
                Dashboard
              </Link>

              {/* GitHub Avatar */}

              <img
                src={user?.imageUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-white/20"
              />

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </button>

            </div>

          )}

        </div>

        <Hero />

        {/* ABOUT */}

        <section id="about" className="max-w-6xl mx-auto px-6 py-32 text-center">

          <h2 className="text-4xl font-bold mb-8">
            What is ShipStack
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            ShipStack is a Docker-native CI/CD platform that gives
            developers full control over builds, deployments,
            and infrastructure without vendor lock-in.
          </p>

        </section>

        {/* DASHBOARD PREVIEW */}

        <section className="max-w-6xl mx-auto px-6 py-32 text-center">

          <h2 className="text-4xl font-bold mb-12">
            ShipStack Dashboard
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">

            <Image
              src="/demo/deployed-demo.png"
              alt="dashboard"
              width={1200}
              height={700}
              className="rounded-xl"
            />

          </div>

        </section>

        {/* FEATURES */}

        <section id="features" className="max-w-6xl mx-auto px-6 py-32">

          <h2 className="text-3xl font-bold text-center mb-16">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <Feature icon={<GitBranch />} title="Git Deployments"/>
            <Feature icon={<Server />} title="Isolated Workers"/>
            <Feature icon={<Boxes />} title="Docker Pipelines"/>
            <Feature icon={<Activity />} title="Real-time Logs"/>
            <Feature icon={<RotateCcw />} title="Rollback Support"/>
            <Feature icon={<Rocket />} title="Fast Deployments"/>

          </div>

        </section>

      </div>

    </main>
  );
}

function Feature({icon,title}:{icon:React.ReactNode,title:string}){

  return(
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:border-purple-400 transition">

      <div className="text-blue-400 mb-4">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

    </div>
  );
}