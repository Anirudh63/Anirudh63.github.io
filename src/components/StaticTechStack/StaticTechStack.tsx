"use client";

import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import {
  BrainCircuit,
  Layers,
  Database,
  KeyRound,
  Zap,
  Terminal,
  Cpu,
  GitFork,
  Globe,
} from "lucide-react";
import {
  SiLangchain,
  SiPytorch,
  SiHuggingface,
  SiGooglegemini,
  SiFastapi,
  SiNextdotjs,
  SiNodedotjs,
  SiAmazonwebservices,
  SiGithub,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiDrizzle,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import { PythonIcon } from "@/components/icons/PythonIcon";
import { CplusplusIcon } from "@/components/icons/CplusplusIcon";
import { TypescriptIcon } from "@/components/icons/TypescriptIcon";
import { DockerIcon } from "@/components/icons/DockerIcon";
import { GitIcon } from "@/components/icons/GitIcon";
import { MongoDBIcons } from "@/components/icons/MongodbIcon";
import { PostmanIcon } from "@/components/icons/PostmanIcon";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Category = "All" | "AI / Retrieval" | "Backend" | "Infrastructure" | "Data";
type Tool = {
  name: string;
  icon: Icon;
  category: Exclude<Category, "All">;
  color?: string;
};

const categories: Category[] = ["All", "AI / Retrieval", "Backend", "Infrastructure", "Data"];

const tools: Tool[] = [
  // AI / Retrieval
  { name: "RAG", icon: BrainCircuit, category: "AI / Retrieval", color: "#38bdf8" },
  { name: "LangChain", icon: SiLangchain as unknown as Icon, category: "AI / Retrieval", color: "#22c55e" },
  { name: "LangGraph", icon: GitFork, category: "AI / Retrieval", color: "#818cf8" },
  { name: "Hugging Face", icon: SiHuggingface as unknown as Icon, category: "AI / Retrieval", color: "#FFD21E" },
  { name: "PyTorch", icon: SiPytorch as unknown as Icon, category: "AI / Retrieval", color: "#EE4C2C" },
  { name: "Gemini", icon: SiGooglegemini as unknown as Icon, category: "AI / Retrieval", color: "#4E88FF" },
  { name: "FAISS", icon: Cpu, category: "AI / Retrieval", color: "#0ea5e9" },
  { name: "Chroma", icon: Layers, category: "AI / Retrieval", color: "#f43f5e" },
  { name: "Pinecone", icon: Database, category: "AI / Retrieval", color: "#10b981" },

  // Backend
  { name: "Python", icon: PythonIcon, category: "Backend" },
  { name: "C++", icon: CplusplusIcon, category: "Backend" },
  { name: "FastAPI", icon: SiFastapi as unknown as Icon, category: "Backend", color: "#009688" },
  { name: "Next.js", icon: SiNextdotjs as unknown as Icon, category: "Backend", color: "#f8fafc" },
  { name: "TypeScript", icon: TypescriptIcon, category: "Backend" },
  { name: "Java", icon: FaJava as unknown as Icon, category: "Backend", color: "#ED8B00" },
  { name: "Node.js", icon: SiNodedotjs as unknown as Icon, category: "Backend", color: "#5FA04E" },
  { name: "Playwright", icon: Terminal, category: "Backend", color: "#45BA4B" },

  // Infrastructure
  { name: "Docker", icon: DockerIcon, category: "Infrastructure" },
  { name: "AWS", icon: SiAmazonwebservices as unknown as Icon, category: "Infrastructure", color: "#FF9900" },
  { name: "Git", icon: GitIcon, category: "Infrastructure" },
  { name: "GitHub", icon: SiGithub as unknown as Icon, category: "Infrastructure", color: "#f1f5f9" },
  { name: "GitHub OAuth", icon: KeyRound, category: "Infrastructure", color: "#a855f7" },
  { name: "Browserbase", icon: Globe, category: "Infrastructure", color: "#3b82f6" },
  { name: "Postman", icon: PostmanIcon, category: "Infrastructure" },

  // Data
  { name: "PostgreSQL", icon: SiPostgresql as unknown as Icon, category: "Data", color: "#4169E1" },
  { name: "MySQL", icon: SiMysql as unknown as Icon, category: "Data", color: "#00758F" },
  { name: "MongoDB", icon: MongoDBIcons, category: "Data" },
  { name: "Pinecone", icon: Database, category: "Data", color: "#10b981" },
  { name: "Neon", icon: Zap, category: "Data", color: "#00E599" },
  { name: "Drizzle ORM", icon: SiDrizzle as unknown as Icon, category: "Data", color: "#C5F74F" },
  { name: "Firebase / Firestore", icon: SiFirebase as unknown as Icon, category: "Data", color: "#FFCA28" },
];

import { AnimatePresence, motion } from "framer-motion";

export default function StaticTechStack() {
  const [selected, setSelected] = useState<Category>("All");
  const visibleTools = useMemo(
    () => selected === "All" ? tools : tools.filter((tool) => tool.category === selected),
    [selected],
  );

  return (
    <div className="border-y border-border/65 py-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-mono text-[11px] tracking-[0.08em] text-foreground/42">
          tools that have earned a place in the toolbox
        </p>

        <div className="flex flex-wrap gap-x-1.5 gap-y-2" aria-label="Filter technology stack">
          {categories.map((category) => {
            const active = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                aria-pressed={active}
                className={
                  "relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 " +
                  (active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/55 hover:bg-foreground/[0.06] hover:text-foreground")
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        layout
        className="mt-6 flex min-h-24 flex-wrap content-start gap-2.5"
      >
        <AnimatePresence mode="popLayout">
          {visibleTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                className="group relative inline-flex h-10 items-center gap-2.5 rounded-lg border border-border/70 bg-card/40 px-3.5 text-sm text-foreground/75 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:bg-card/70 hover:text-foreground hover:shadow-lg hover:shadow-black/20"
              >
                {/* Subtle colored glow on hover */}
                {tool.color && (
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      boxShadow: `0 0 16px -4px ${tool.color}33`,
                    }}
                    aria-hidden="true"
                  />
                )}

                <span
                  className="flex h-5 w-5 items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-115 [&>svg]:h-4 [&>svg]:w-4"
                  style={tool.color ? { color: tool.color } : undefined}
                >
                  <ToolIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-medium text-[13px]">{tool.name}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
