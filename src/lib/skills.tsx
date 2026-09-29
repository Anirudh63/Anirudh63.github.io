// src/lib/skills.tsx
import { SVGProps } from "react";
import {
  BrainCircuit,
  Database,
  GitBranch,
  Image as LucideImage,
} from "lucide-react";
import { TypescriptIcon } from "@/components/icons/TypescriptIcon";
import { JavascriptIcon } from "@/components/icons/JavascriptIcon";
import { PythonIcon } from "@/components/icons/PythonIcon";
import { VercelIcon } from "@/components/icons/VercelIcon";
import { NodedotjsIcon } from "@/components/icons/NodedotjsIcon";
import { PrismaIcon } from "@/components/icons/PrismaIcon";
import { SolanaIcon } from "@/components/icons/SolanaIcon";
import { MongoDBIcons } from "@/components/icons/MongodbIcon";
import { DockerIcon } from "@/components/icons/DockerIcon";
import { GoogleCloudIcon } from "@/components/icons/GooglecloudIcon";
import { TensorFlowIcon } from "@/components/icons/TensorflowIcon";
import { GithubactionsIcon } from "@/components/icons/GithubactionsIcon";
import { PostmanIcon } from "@/components/icons/PostmanIcon";
import { CplusplusIcon } from "@/components/icons/CplusplusIcon";
import { ReactIcon } from "@/components/icons/ReactIcon";
import { NextdotJSIcons } from "@/components/icons/NextdotjsIcon";


export type Skill = {
  name: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

// NEW CATEGORIES - Storytelling Architecture

// The battle-tested tools you use to ship robust products
export const coreToolkit: Skill[] = [
  { name: "TypeScript", icon: TypescriptIcon },
  { name: "JavaScript", icon: JavascriptIcon },
  { name: "React.js", icon: ReactIcon },
  { name: "Next.js", icon: NextdotJSIcons },
  { name: "Node.js", icon: NodedotjsIcon },
  { name: "Python", icon: PythonIcon },
  { name: "C++", icon: CplusplusIcon },
  { name: "Prisma", icon: PrismaIcon },
  { name: "MongoDB", icon: MongoDBIcons },
  { name: "SQL", icon: Database },
];

// What you're daring to build with - Your focus for the next generation
export const theFrontier: Skill[] = [
  { name: "Solana", icon: SolanaIcon },
  { name: "Machine Learning", icon: BrainCircuit },
  { name: "TensorFlow", icon: TensorFlowIcon },
  { name: "GenAI", icon: BrainCircuit },
  { name: "StyleGAN", icon: LucideImage },
];

// How you bring your ideas to the world, reliably
export const infrastructureAndOps: Skill[] = [
  { name: "Docker", icon: DockerIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "Google Cloud", icon: GoogleCloudIcon },
  { name: "Git", icon: GitBranch },
  { name: "GitHub Actions", icon: GithubactionsIcon },
  { name: "Postman", icon: PostmanIcon },
];

// Curated list for the dynamic tech stack spinner
export const dynamicSkillsForSpinner: string[] = [
  "TypeScript",
  "Next.js",
  "Solana",
  "Rust",
  "Python",
  "Docker",
  "TensorFlow",
  "React",
  "Machine Learning",
  "Prisma",
];

// Dedicated array for visual tech stack carousel
export const techStackCarousel: Skill[] = [
  { name: "TypeScript", icon: TypescriptIcon },
  { name: "React.js", icon: ReactIcon },
  { name: "Next.js", icon: NextdotJSIcons },
  { name: "Solana", icon: SolanaIcon },
  { name: "Python", icon: PythonIcon },
  { name: "Docker", icon: DockerIcon },
  { name: "TensorFlow", icon: TensorFlowIcon },
  { name: "Prisma", icon: PrismaIcon },
];
