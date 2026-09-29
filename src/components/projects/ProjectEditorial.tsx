"use client";

import Image from "next/image";
import React from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export type EditorialProject = {
  title: string;
  number: string;
  eyebrow?: string;
  description: string;
  evidence?: string;
  technologies?: string[];
  image?: string;
  link?: string | null;
  githubLink?: string;
  isLive?: boolean;
};

function TechLine({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <p className="mt-3 text-[12px] leading-relaxed text-foreground/55">
      {items.join(" · ")}
    </p>
  );
}

function Links({ link, githubLink }: { link?: string | null; githubLink?: string }) {
  if (!link && !githubLink) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="link-magnetic inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
          <ArrowUpRight className="h-4 w-4 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link-magnetic inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
        >
          <span>Live</span>
          <ArrowUpRight className="h-4 w-4 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-foreground/[0.025] p-6 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/45">
          {title}
        </p>
        <p className="mt-2 text-xs text-foreground/35">Project image coming soon</p>
      </div>
    </div>
  );
}

export function ProjectEditorialFeatured({ project }: { project: EditorialProject }) {
  return (
    <article className="border-t border-border/70 pt-8">
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-sm border border-border/60 bg-card/20">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <Placeholder title={project.title} />
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[32px] font-semibold tracking-tight text-foreground sm:text-[38px]">
              {project.title}
            </h3>
            <span className="font-mono text-[11px] tracking-[0.22em] text-foreground/40">
              {project.number}
            </span>
          </div>
          {project.eyebrow && (
            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.22em] text-foreground/45">
              {project.eyebrow}
            </p>
          )}
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-foreground/70">
            {project.description}
          </p>

          {project.evidence && (
            <p className="mt-3 text-[13px] text-foreground/60">
              <span className="font-mono">6 → 0</span>
              <span className="text-foreground/45">&nbsp;silent failures</span>
              <span className="text-foreground/35"> · </span>
              <span className="font-mono">22</span>
              <span className="text-foreground/45">&nbsp;cases</span>
            </p>
          )}

          <TechLine items={project.technologies} />
          <Links link={project.link} githubLink={project.githubLink} />
        </div>
      </div>
    </article>
  );
}

export function ProjectEditorialCard({ project, index = 0 }: { project: EditorialProject; index?: number }) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const visualHref = project.link ?? project.githubLink;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const visual = (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/65 bg-card/40">
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          priority={false}
        />
      ) : (
        <Placeholder title={project.title} />
      )}
      {project.isLive && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/90 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80 shadow-sm backdrop-blur-md">
          <span className="status-dot-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      )}

      {/* Hover overlay with project number */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span className="font-mono text-5xl font-bold text-foreground/15">
          {project.number}
        </span>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-shine-effect group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-foreground/30 hover:bg-card/70 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Subtle Mouse-following Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.06), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div>
        {visualHref ? (
          <a
            href={visualHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="block overflow-hidden"
          >
            {visual}
          </a>
        ) : (
          visual
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[22px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground sm:text-[25px]">
                {project.title}
              </h3>
              {project.eyebrow && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/45">
                  {project.eyebrow}
                </p>
              )}
            </div>
            <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-foreground/30 transition-all duration-300 group-hover:text-foreground/75 group-hover:scale-110">
              {project.number}
            </span>
          </div>

          <p className="mt-4 text-[14px] leading-relaxed text-foreground/70 sm:text-[15px]">
            {project.description}
          </p>

          {project.evidence && (
            <p className="mt-3 border-l-2 border-emerald-400/60 pl-3 text-[12px] leading-relaxed text-foreground/60">
              {project.evidence}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies?.map((tech, techIdx) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: 0.3 + techIdx * 0.03 }}
                className="rounded-md border border-border/60 bg-foreground/[0.025] px-2 py-0.5 font-mono text-[11px] text-foreground/60 transition-all duration-200 group-hover:border-foreground/20 group-hover:text-foreground/80 hover:-translate-y-0.5"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
        <Links link={project.link} githubLink={project.githubLink} />
      </div>
    </motion.article>
  );
}
