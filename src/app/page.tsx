import { Suspense } from "react";
import ConsoleShell from "@/components/console/ConsoleShell";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--bg-0)]" />}>
      <ConsoleShell />
    </Suspense>
  );
}
