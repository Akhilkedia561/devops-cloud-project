"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const steps = [
  { label: "Git Push", icon: "/icons/git.png" },
  { label: "Build", icon: "/icons/build.png" },
  { label: "Docker", icon: "/icons/docker.png" },
  { label: "Deploy", icon: "/icons/rocket.png", isRocket: true },
  { label: "Live", icon: "/icons/globe.png" },
];

export default function Hero() {
  const [deploying, setDeploying] = useState(false);
  const [rocketLaunch, setRocketLaunch] = useState(false);
  const [blast, setBlast] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  /* CURSOR SPOTLIGHT */

  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* DEPLOY ANIMATION */

  const startDeploy = () => {
    if (deploying) return;

    setDeploying(true);

    setTimeout(() => setRocketLaunch(true), 2200);
    setTimeout(() => setBlast(true), 3600);

    setTimeout(() => {
      setBlast(false);
      setShowDemo(true);
    }, 3900);

    setTimeout(() => {
      setShowDemo(false);
      setDeploying(false);
      setRocketLaunch(false);
    }, 10900);
  };

  return (
    <section className="relative pt-40 pb-56 px-6 text-center overflow-hidden">

      {/* CURSOR SPOTLIGHT */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.12), transparent 40%)",
        }}
      />

      {/* PARALLAX GLOW */}

      <div
        className="absolute -top-32 right-20 w-[600px] h-[600px] blur-[160px]"
        style={{
          background: "rgba(59,130,246,0.25)",
        }}
      />

      <div
        className="absolute -bottom-32 left-20 w-[600px] h-[600px] blur-[160px]"
        style={{
          background: "rgba(168,85,247,0.25)",
        }}
      />

      {/* FLOATING DEVOPS NODES */}

      <div className="absolute inset-0 pointer-events-none">
        <span className="node node1" />
        <span className="node node2" />
        <span className="node node3" />
        <span className="node node4" />
      </div>

      {/* HERO TEXT */}

      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Deploy. Launch. Go Live.
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg">
        Experience a full CI/CD deployment — from Git push to live production.
      </p>

      {/* PIPELINE */}

      <div
        onClick={startDeploy}
        className="relative mt-20 mx-auto max-w-5xl cursor-pointer"
      >

        {/* pipeline line */}

        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40" />

        {/* deploy flow dot */}

        {deploying && (
          <span className="absolute top-1/2 left-0 h-3 w-3 rounded-full bg-blue-400 animate-deploy-flow shadow-[0_0_20px_#3b82f6]" />
        )}

        {/* steps */}

        <div className="relative z-10 flex items-center justify-between">

          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-3">

              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur bg-white/5 transition-all duration-700 hover:scale-110"
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <Image
                  src={step.icon}
                  alt={step.label}
                  width={42}
                  height={42}
                  className={
                    step.isRocket && rocketLaunch
                      ? "animate-rocket-launch"
                      : ""
                  }
                />
              </div>

              <span className="text-sm text-gray-300">
                {step.label}
              </span>

            </div>
          ))}

        </div>

      </div>

      <p className="mt-6 text-sm text-gray-400">
        Click the pipeline to deploy
      </p>

      {/* WHITE BLAST */}

      {blast && (
        <div className="fixed inset-0 z-50 bg-white animate-blast" />
      )}

      {/* DEPLOYED DEMO */}

      {showDemo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">

          <Image
            src="/demo/deployed-demo.png"
            alt="Deployed Website"
            width={900}
            height={520}
            className="rounded-xl shadow-2xl animate-demo-in"
          />

        </div>
      )}

      {/* ANIMATIONS */}

      <style jsx global>{`

        @keyframes deploy-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        .animate-deploy-flow {
          animation: deploy-flow 2.2s linear forwards;
        }

        @keyframes rocket-launch {
          0% { transform: translate(0,0) scale(1); }
          30% { transform: translate(-20px,-30px) rotate(-10deg); }
          60% { transform: translate(30px,-80px) rotate(10deg); }
          100% { transform: translate(0,-220px) scale(2.2); }
        }

        .animate-rocket-launch {
          animation: rocket-launch 1.4s ease-in forwards;
        }

        @keyframes blast {
          0% { opacity:0; }
          50% { opacity:1; }
          100% { opacity:0; }
        }

        .animate-blast {
          animation: blast 0.4s ease-out forwards;
        }

        @keyframes demo-in {
          0% { opacity:0; transform:scale(.85); }
          100% { opacity:1; transform:scale(1); }
        }

        .animate-demo-in {
          animation: demo-in .6s ease-out forwards;
        }

        .node {
          position:absolute;
          width:6px;
          height:6px;
          border-radius:999px;
          background:#60a5fa;
          box-shadow:0 0 10px #3b82f6;
          animation: float 8s infinite ease-in-out;
        }

        .node1 { top:20%; left:15%; }
        .node2 { top:35%; right:20%; }
        .node3 { bottom:30%; left:25%; }
        .node4 { bottom:20%; right:30%; }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }

      `}</style>

    </section>
  );
}