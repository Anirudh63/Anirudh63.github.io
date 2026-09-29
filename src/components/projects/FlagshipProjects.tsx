import React from "react";
import { projects } from "@/lib/projects";
import {
  ProjectEditorialCard,
  type EditorialProject,
} from "./ProjectEditorial";

function pick(title: string) {
  return projects.find((p) => p.title === title);
}

export function FlagshipProjects() {
  const testforge = pick("TestForge");
  const docflow = pick("DocFlow");
  const meetingmind = pick("MeetingMind");

  const items: EditorialProject[] = [
    {
      title: "TestForge",
      number: "01",
      eyebrow: testforge?.eyebrow ?? "AI Test Automation",
      description:
        testforge?.description ??
        "An AI-powered test automation platform that analyzes GitHub repositories, generates structured UI, API, and authentication test cases, and executes Playwright tests in cloud browsers with real-time results.",
      evidence: testforge?.evidence,
      technologies: testforge?.technologies,
      image: testforge?.image,
      link: testforge?.link ?? null,
      githubLink: testforge?.githubLink,
      isLive: testforge?.isLive,
    },
    {
      title: "DocFlow",
      number: "02",
      eyebrow: docflow?.eyebrow ?? "Document Intelligence",
      description:
        docflow?.description ??
        "An AI-powered document intelligence platform that combines RAG and semantic retrieval to help users understand, navigate, and consume documents more efficiently. It extracts document structure, generates contextual insights, and turns summaries into conversational audio.",
      technologies: docflow?.technologies,
      image: docflow?.image,
      link: docflow?.link ?? null,
      githubLink: docflow?.githubLink,
      isLive: docflow?.isLive,
    },
    {
      title: "MeetingMind",
      number: "03",
      eyebrow: meetingmind?.eyebrow ?? "Enterprise Meeting Intelligence",
      description:
        meetingmind?.description ??
        "An AI-powered meeting intelligence system that transforms meeting transcripts into structured decisions, action items, owners, and follow-ups, while building a searchable knowledge base across an organization’s meetings.",
      technologies: meetingmind?.technologies,
      image: meetingmind?.image,
      link: meetingmind?.link ?? null,
      githubLink: meetingmind?.githubLink,
      isLive: meetingmind?.isLive,
    },
  ];

  return (
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
      {items.map((project, idx) => (
        <ProjectEditorialCard key={project.title} project={project} index={idx} />
      ))}
    </div>
  );
}
