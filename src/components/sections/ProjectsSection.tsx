"use client";

import { useMemo, useState } from "react";
import { projects, type ProjectType } from "@/lib/projects";
import {
  ProjectEditorialCard,
  type EditorialProject,
} from "@/components/projects/ProjectEditorial";

interface ProjectsSectionProps {
  showTitle?: boolean;
}

const categories = ["All", "AI / Agents", "RAG", "Automation"] as const;
type Category = (typeof categories)[number];

function matchesCategory(project: ProjectType, category: Category) {
  if (category === "All") return true;
  if (category === "AI / Agents") {
    return project.technologies.some((tech) =>
      ["LangChain", "LangGraph", "Gemini", "Gemma"].includes(tech)
    );
  }
  if (category === "RAG") {
    return project.technologies.includes("RAG");
  }
  if (category === "Automation") {
    return project.technologies.some((tech) =>
      ["Playwright", "Browserbase"].includes(tech)
    );
  }
  return true;
}

function toEditorial(project: ProjectType, index: number): EditorialProject {
  return {
    ...project,
    number: String(index + 1).padStart(2, "0"),
  };
}

export default function ProjectsSection({ showTitle = true }: ProjectsSectionProps) {
  const [selected, setSelected] = useState<Category>("All");

  const filtered = useMemo(
    () => projects.filter((project) => matchesCategory(project, selected)),
    [selected],
  );

  return (
    <section id="projects" className="space-y-8">
      {showTitle && (
        <div className="space-y-2">
          <p className="section-kicker">01 / Projects</p>
          <h2 className="section-heading">Projects</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/55">
            The full archive :)
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border/60 py-3">
        {categories.map((category) => {
          const active = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              className={
                "relative py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors " +
                (active
                  ? "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-foreground"
                  : "text-foreground/45 hover:text-foreground/75")
              }
              aria-pressed={active}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {filtered.map((project, index) => (
            <ProjectEditorialCard
              key={project.title}
              project={toEditorial(project, index)}
            />
          ))}
        </div>
      ) : (
        <p className="border-t border-border/60 py-10 text-sm text-foreground/45">
          No projects in this category yet.
        </p>
      )}
    </section>
  );
}
