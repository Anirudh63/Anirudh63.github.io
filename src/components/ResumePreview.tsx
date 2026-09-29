// src/components/ResumePreview.tsx
"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResumePreviewProps = {
  className?: string;
  label?: string;
};

const RESUME_URL = "/resume.pdf";

export default function ResumePreview({ className, label = "Resume" }: ResumePreviewProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className={className ?? "h-9 rounded-full border-border/70 bg-card/70 px-4 text-xs text-foreground hover:bg-foreground/10"}
      >
        <FileText className="h-3.5 w-3.5" />
        {label}
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/75 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true">
          <div className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Anirudh Dhage - Resume</p>
                <p className="text-xs text-foreground/50">Preview inside the portfolio, download when needed.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="hidden h-8 rounded-md bg-transparent text-xs sm:inline-flex">
                  <a href={RESUME_URL} download>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="hidden h-8 rounded-md bg-transparent text-xs sm:inline-flex">
                  <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </a>
                </Button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border p-2 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
                  aria-label="Close resume preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe
              src={`${RESUME_URL}#view=FitH`}
              title="Anirudh Dhage resume preview"
              className="h-full w-full bg-white"
            />
            <div className="flex gap-2 border-t border-border bg-background/90 p-3 sm:hidden">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-md bg-transparent text-xs">
                <a href={RESUME_URL} download>
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-md bg-transparent text-xs">
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
