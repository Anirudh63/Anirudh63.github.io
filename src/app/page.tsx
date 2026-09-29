"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import ProjectsSection from "@/components/sections/ProjectsSection";
import { Footer } from "@/components/Footer";
import { FlagshipProjects } from "@/components/projects/FlagshipProjects";
import CodingActivity from "@/components/CodingActivity";
import Achievements from "@/components/Achievements";
import StaticTechStack from "@/components/StaticTechStack/StaticTechStack";
import SectionHeader from "@/components/SectionHeader";
import ThemeToggle from "@/components/ThemeToggle";
import VisitorCounter from "@/components/VisitorCounter";
import NowPlaying from "@/components/NowPlaying";
import ResumePreview from "@/components/ResumePreview";

const navItems = ["home", "projects"] as const;
type ActiveView = (typeof navItems)[number];

const XIcon = () => (
  <svg
    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function TopNav({
  activeView,
  setActiveView,
}: {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/80 shadow-md shadow-black/10 backdrop-blur-xl"
          : "border-border/40 bg-background/50 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setActiveView("home")}
          className="group flex items-center gap-2.5 rounded-full text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-85"
        >
          <div className="relative overflow-hidden rounded-full border border-border/80 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/photo2.jpg"
              alt="Anirudh Dhage"
              width={30}
              height={30}
              className="aspect-square rounded-full object-cover"
            />
          </div>
          <span className="font-mono text-sm tracking-tight">Anirudh</span>
        </button>

        <nav className="hidden items-center rounded-full border border-border/80 bg-card/60 p-1 text-sm text-foreground/60 shadow-lg shadow-black/10 backdrop-blur-md sm:flex">
          {navItems.map((item) => {
            const active = activeView === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveView(item)}
                className={
                  "relative rounded-full px-4 py-1.5 font-medium capitalize transition-all duration-200 " +
                  (active
                    ? "bg-foreground text-background shadow-sm"
                    : "hover:text-foreground")
                }
              >
                {item}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full border border-border bg-card/70 p-2 text-foreground/70 sm:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 p-3 backdrop-blur-xl sm:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setActiveView(item);
                  setMobileOpen(false);
                }}
                className="rounded-md px-3 py-2 text-left text-sm capitalize text-foreground/75 hover:bg-foreground/10"
              >
                {item}
              </button>
            ))}
            <a
              className="rounded-md px-3 py-2 text-sm text-foreground/75 hover:bg-foreground/10"
              href="https://github.com/Anirudh63"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="rounded-md px-3 py-2 text-sm text-foreground/75 hover:bg-foreground/10"
              href="mailto:anirudhdhage72@gmail.com"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const bulletPoints = [
    "I'm a Computer Engineering student who learns by building first, then pulling things apart until I understand how they work.",
    "I build around AI systems, backend engineering, RAG, and LLMs, with a focus on turning complex ideas into reliable, usable products.",
    "I enjoy going beyond making things work — understanding bottlenecks, finding failure points, and refining the details until the system feels simple.",
    "When I'm not building, I'm probably solving a DSA problem or exploring something new in systems and AI.",
  ];

  return (
    <section id="home" className="section-block pt-8 sm:pt-12">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hero-banner mb-8 overflow-hidden rounded-lg border border-border/80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://github.com/user-attachments/assets/bef5e226-e90d-476e-876c-617af679fce3"
          alt="Animated personal banner"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="grid gap-8 md:grid-cols-[148px_1fr] md:items-start">
        {/* Profile Image with subtle entrance and hover effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative w-max"
        >
          <div className="avatar-glow-ring relative overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-2xl shadow-black/30 transition-all duration-300 group-hover:scale-[1.03] group-hover:border-foreground/30 group-hover:shadow-foreground/5">
            <Image
              src="/photo2.jpg"
              alt="Anirudh Dhage's profile picture"
              width={132}
              height={132}
              priority
              className="aspect-square rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </motion.div>

        {/* Info & Bio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Metadata pill line */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/48">
            <span>India</span>
            <span>/</span>
            <span>AI systems</span>
            <span>/</span>
            <span>open to internships &amp; full-time roles</span>
          </div>

          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="hero-name-gradient inline-block pb-2 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl leading-[1.2]"
            >
              Anirudh Dhage
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="font-mono text-base text-foreground/62 sm:text-lg"
            >
              AI Systems / Competitive Programmer
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="max-w-2xl text-base leading-relaxed text-foreground/70"
            >
              I like solving hard problems, building things that shouldn&apos;t
              work but somehow do, and figuring out why they break.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="max-w-2xl text-sm leading-relaxed text-foreground/55"
            >
              Currently building with AI, backend systems while sharpening my
              problem-solving skills through competitive programming.
            </motion.p>
          </div>

          {/* Social Action Buttons with micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-wrap gap-2.5"
          >
            <a
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 text-xs font-medium text-foreground/75 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
              href="https://github.com/Anirudh63"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              <span>GitHub</span>
            </a>
            <a
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 text-xs font-medium text-foreground/75 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
              href="https://www.linkedin.com/in/anirudh-dhage-4abb3228a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </a>
            <a
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 text-xs font-medium text-foreground/75 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
              href="https://x.com/anirudh_72dhage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon />
              <span>X</span>
            </a>
            <ResumePreview label="Resume" />
            <a
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 text-xs font-medium text-foreground/75 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
              href="mailto:anirudhdhage72@gmail.com"
            >
              <Mail className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              <span>Email</span>
            </a>
          </motion.div>

          {/* Real-time counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            <VisitorCounter />
            <NowPlaying />
          </motion.div>
        </motion.div>
      </div>

      {/* About Subsection with staggered reveals */}
      <div className="mt-12 border-t border-border/65 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/45">
          About
        </p>
        <ul className="mt-5 max-w-4xl space-y-4 text-[15px] leading-relaxed text-foreground/70 sm:text-base">
          {bulletPoints.map((text, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[12px_1fr] gap-3"
            >
              <span className="mt-[0.65em] h-1.5 w-1.5 rounded-full bg-foreground/40" />
              <p>{text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("home");

  return (
    <>
      <TopNav activeView={activeView} setActiveView={setActiveView} />
      <main className="w-full overflow-x-hidden px-3 sm:px-6">
        <div className="page-shell mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "home" && (
                <div>
                  <Hero />

                  {/* 01 / Projects */}
                  <section id="projects" className="section-block section-glow-line">
                    <SectionHeader
                      kicker="01 / Projects"
                      heading="Projects"
                      subtitle="A few things I've been building."
                    />
                    <div className="mt-8">
                      <FlagshipProjects />
                    </div>
                  </section>

                  {/* 02 / Stack */}
                  <section id="stack" className="section-block section-glow-line">
                    <SectionHeader
                      kicker="02 / Stack"
                      heading="Stack"
                    />
                    <div className="mt-6">
                      <StaticTechStack />
                    </div>
                  </section>

                  {/* 03 / Competitive Programming */}
                  <section id="competitive-programming" className="section-block section-glow-line">
                    <SectionHeader
                      kicker="03 / Competitive Programming"
                      heading="Competitive Programming"
                      subtitle="A look at my problem-solving journey across LeetCode and Codeforces."
                    />
                    <div className="mt-8">
                      <CodingActivity />
                    </div>
                  </section>

                  {/* 04 / Achievements */}
                  <section id="achievements" className="section-block section-glow-line">
                    <SectionHeader
                      kicker="04 / Achievements"
                      heading="Achievements &amp; Milestones"
                      subtitle="Contests, competitive programming ratings, and hackathon highlights."
                    />
                    <div className="mt-8">
                      <Achievements />
                    </div>
                  </section>
                </div>
              )}

              {activeView === "projects" && (
                <div className="section-block pt-12">
                  <ProjectsSection />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
      </main>
    </>
  );
}
