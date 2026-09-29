// src/components/VisitorCounter.tsx
"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

type VisitorPayload = {
  configured?: boolean;
  count?: number;
  isNewVisitor?: boolean;
};

export default function VisitorCounter() {
  const [data, setData] = useState<VisitorPayload | null>(null);

  useEffect(() => {
    fetch("/api/visitors", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: VisitorPayload) => setData(payload))
      .catch(() => setData({ configured: false }));
  }, []);

  if (!data?.configured || !data.count) return null;

  const count = data.count;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs text-foreground/60 backdrop-blur-md">
      <Eye size={14} className="text-foreground/40" />
      <span className="font-mono tabular-nums text-foreground/80">
        {count.toLocaleString()}
      </span>
      <span>{data?.isNewVisitor ? "new visitor" : "visits"}</span>
    </div>
  );
}
