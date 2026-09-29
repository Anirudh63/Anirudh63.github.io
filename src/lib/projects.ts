// src/lib/projects.ts
export type ProjectType = {
  title: string;
  eyebrow?: string;
  description: string;
  evidence?: string;
  technologies: string[];
  image?: string;
  link: string | null;
  githubLink?: string;
  isLive?: boolean;
  category?: string;
  isFeatured?: boolean;
};

export const projects: ProjectType[] = [
  {
    title: "TestForge",
    eyebrow: "AI Test Automation",
    category: "AI Automation",
    isFeatured: true,
    description:
      "An AI-powered test automation platform that analyzes GitHub repositories, generates structured UI, API, and authentication test cases, and executes Playwright tests in cloud browsers with real-time results.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Gemini",
      "Playwright",
      "Browserbase",
      "PostgreSQL",
      "Drizzle",
    ],
    image: "/testforge.png",
    link: null,
    githubLink: "https://github.com/Anirudh63/TestForge",
    isLive: false,
  },
  {
    title: "DocFlow",
    eyebrow: "Document Intelligence",
    category: "AI / RAG",
    description:
      "An AI-powered document intelligence platform that combines RAG and semantic retrieval to help users understand, navigate, and consume documents more efficiently. It extracts document structure, generates contextual insights, and turns summaries into conversational audio.",
    technologies: ["Python", "RAG", "PyMuPDF", "Gemma", "Chroma", "Google Cloud TTS"],
    isFeatured: true,
    image: "/docflow.png",
    link: null,
    githubLink: "https://github.com/Anirudh63",
    isLive: false,
  },
  {
    title: "MeetingMind",
    eyebrow: "Enterprise Meeting Intelligence",
    category: "AI / Agents",
    isFeatured: true,
    description:
      "An AI-powered meeting intelligence system that transforms meeting transcripts into structured decisions, action items, owners, and follow-ups, while building a searchable knowledge base across an organization’s meetings.",
    technologies: [
      "LangChain",
      "LangGraph",
      "RAG",
      "FAISS",
      "Pinecone",
      "FastAPI",
      "Slack",
      "Notion",
    ],
    image: "/meetingmind.png",
    link: null,
    githubLink: "https://github.com/Anirudh63",
    isLive: false,
  },
];
