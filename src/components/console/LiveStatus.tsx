"use client";

import { useEffect, useState } from "react";

export default function LiveStatus({ fallback }: { fallback: string }) {
  const [status, setStatus] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { status?: string }) => {
        if (!cancelled && data.status) setStatus(data.status);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{status}</>;
}
