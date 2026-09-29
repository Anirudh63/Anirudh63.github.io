"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Terminal as TerminalIcon,
  X,
  Search,
  ArrowRight,
  Github,
  Linkedin,
  FileText,
  Code2,
  Layers,
  Trophy,
} from "lucide-react";
import { SiCodeforces, SiLeetcode } from "react-icons/si";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Links" | "CLI Commands";
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export default function TerminalHud() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openLink = (url: string) => {
    setIsOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = "";

    switch (trimmed) {
      case "help":
        response = "Available commands: 'projects', 'skills', 'cf', 'lc', 'resume', 'contact', 'clear', 'sudo'";
        break;
      case "projects":
        scrollTo("projects");
        return;
      case "skills":
      case "stack":
        scrollTo("stack");
        return;
      case "cf":
      case "codeforces":
        openLink("https://codeforces.com/profile/DestructorX");
        return;
      case "lc":
      case "leetcode":
        openLink("https://leetcode.com/u/anirudh_dhage/");
        return;
      case "resume":
        openLink("/resume.pdf");
        return;
      case "contact":
      case "email":
        window.location.href = "mailto:anirudhdhage72@gmail.com";
        setIsOpen(false);
        return;
      case "clear":
        setTerminalLogs([]);
        setQuery("");
        return;
      case "sudo":
      case "sudo make me a sandwich":
        response = "Permission denied: you are already running at peak engineering capacity.";
        break;
      case "easteregg":
      case "matrix":
        response = "01000001 01101110 01101001 01110010 01110101 01100100 01101000 2026 // System online.";
        break;
      default:
        response = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    setTerminalLogs((prev) => [...prev, `> ${cmd}`, response]);
    setQuery("");
  };

  const commands: CommandItem[] = [
    {
      id: "nav-projects",
      title: "Jump to Projects",
      category: "Navigation",
      icon: Layers,
      action: () => scrollTo("projects"),
      shortcut: "01",
    },
    {
      id: "nav-stack",
      title: "Jump to Tech Stack",
      category: "Navigation",
      icon: Code2,
      action: () => scrollTo("stack"),
      shortcut: "02",
    },
    {
      id: "nav-cp",
      title: "Jump to Competitive Programming",
      category: "Navigation",
      icon: SiCodeforces,
      action: () => scrollTo("competitive-programming"),
      shortcut: "03",
    },
    {
      id: "nav-achievements",
      title: "Jump to Achievements",
      category: "Navigation",
      icon: Trophy,
      action: () => scrollTo("achievements"),
      shortcut: "04",
    },
    {
      id: "link-github",
      title: "GitHub Profile (@Anirudh63)",
      category: "Links",
      icon: Github,
      action: () => openLink("https://github.com/Anirudh63"),
    },
    {
      id: "link-linkedin",
      title: "LinkedIn Profile",
      category: "Links",
      icon: Linkedin,
      action: () => openLink("https://www.linkedin.com/in/anirudh-dhage-4abb3228a/"),
    },
    {
      id: "link-leetcode",
      title: "LeetCode (@anirudh_dhage)",
      category: "Links",
      icon: SiLeetcode,
      action: () => openLink("https://leetcode.com/u/anirudh_dhage/"),
    },
    {
      id: "link-codeforces",
      title: "Codeforces (@DestructorX)",
      category: "Links",
      icon: SiCodeforces,
      action: () => openLink("https://codeforces.com/profile/DestructorX"),
    },
    {
      id: "link-resume",
      title: "View / Download Resume",
      category: "Links",
      icon: FileText,
      action: () => openLink("/resume.pdf"),
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Floating Shortcut Pill (Bottom Right) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open command palette"
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-border/80 bg-card/85 px-3 py-1.5 font-mono text-xs text-foreground/60 shadow-lg shadow-black/20 backdrop-blur-md transition-all hover:border-foreground/30 hover:bg-card hover:text-foreground hover:scale-105 active:scale-95 sm:inline-flex"
      >
        <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-[11px]">Command Menu</span>
        <kbd className="rounded border border-border/60 bg-foreground/[0.05] px-1.5 py-0.5 text-[10px] text-foreground/50">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 p-4 pt-16 backdrop-blur-xl sm:pt-24"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl shadow-black/40 ring-1 ring-border/50">
            {/* Command Input Bar */}
            <div className="flex items-center gap-3 border-b border-border/70 bg-background/50 px-4 py-3.5">
              <Search className="h-4 w-4 text-foreground/45 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (query.trim().startsWith(">") || query.trim().startsWith("/")) {
                      executeCommand(query.replace(/^[>/]/, ""));
                    } else if (filtered.length > 0) {
                      filtered[0].action();
                    } else {
                      executeCommand(query);
                    }
                  }
                }}
                placeholder="Type a command or jump to section (e.g. 'projects', 'resume', 'help')..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-border/60 p-1 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Terminal Output Logs if any */}
            {terminalLogs.length > 0 && (
              <div className="max-h-36 overflow-y-auto border-b border-border/60 bg-black/40 p-3 font-mono text-xs text-emerald-400">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Filtered Action Items */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                Navigation & Quick Links
              </div>

              <div className="space-y-1">
                {filtered.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={cmd.action}
                      className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-foreground/[0.07] hover:text-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-foreground/[0.03] text-foreground/60 transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium text-xs sm:text-sm">{cmd.title}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] text-foreground/40">
                        {cmd.shortcut && (
                          <span className="rounded border border-border/60 bg-foreground/[0.04] px-1.5 py-0.5">
                            {cmd.shortcut}
                          </span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-foreground/50">
                  <p>Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to execute as CLI command.</p>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-border/60 bg-background/50 px-4 py-2.5 font-mono text-[11px] text-foreground/40">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>anirudh-portfolio // v2.0</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="rounded border border-border/60 px-1">↑</kbd><kbd className="rounded border border-border/60 px-1">↓</kbd></span>
                <span>Select: <kbd className="rounded border border-border/60 px-1">↵</kbd></span>
                <span>Close: <kbd className="rounded border border-border/60 px-1">ESC</kbd></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
