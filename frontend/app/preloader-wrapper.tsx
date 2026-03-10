"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";

export default function ClientPreloaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <Preloader onFinish={() => setDone(true)} />}
      <div className={done ? "appReveal appReveal--show" : "appReveal"}>
        {children}
      </div>
    </>
  );
}
