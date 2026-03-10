"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PreloaderProps = {
  onFinish?: () => void;
};

export default function Preloader({ onFinish }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"count" | "hole" | "done">("count");

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Total time for 0->100 (ms)
  const DURATION = 1400; // smooth, not too slow

  const easing = useMemo(() => {
    // Smooth easeInOut
    return (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  }, []);

  useEffect(() => {
    // Animate progress 0 -> 100 using requestAnimationFrame
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;

      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / DURATION);
      const eased = easing(t);
      const val = Math.round(eased * 100);

      setProgress(val);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // when counter hits 100, go to hole reveal
        setTimeout(() => setPhase("hole"), 260);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [easing]);

  useEffect(() => {
    if (phase === "hole") {
      // Hole expands then we finish
      const t1 = setTimeout(() => {
        setPhase("done");
        onFinish?.();
      }, 950); // hole expansion time

      return () => clearTimeout(t1);
    }
  }, [phase, onFinish]);

  return (
    <div
      className={[
        "preloader",
        phase === "hole" ? "preloader--hole" : "",
        phase === "done" ? "preloader--done" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* background */}
      <div className="preloader__bg" />

      {/* counter */}
      <div className="preloader__content">
        <div className="preloader__title">ShipStack</div>

        <div className="preloader__meter">
          <div className="preloader__bar">
            <div
              className="preloader__barFill"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          <div className="preloader__percent">
            {progress}
            <span className="preloader__percentSign">%</span>
          </div>
        </div>

        <div className="preloader__hint">Deploying your experience…</div>
      </div>

      {/* hole reveal */}
      <div className="preloader__holeLayer">
        <div className="preloader__hole" />
      </div>
    </div>
  );
}
