"use client";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useEffect } from "react";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { x, y } = useMousePosition();

  useEffect(() => {
    document.documentElement.style.setProperty("--mouse-x", `${x}px`);
    document.documentElement.style.setProperty("--mouse-y", `${y}px`);
  }, [x, y]);

  return <>{children}</>;
}
