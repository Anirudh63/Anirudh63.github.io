"use client";

import React from "react";
import { Trophy, Code2, Medal, Sparkles } from "lucide-react";
import { SiCodeforces, SiCodechef } from "react-icons/si";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import SpotlightCard from "@/components/SpotlightCard";

interface AchievementItem {
  category: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  counterValue?: number;
  counterSuffix?: string;
  spotlightColor: string;
  customClass?: string;
  starsCount?: number;
}

const achievements: AchievementItem[] = [
  {
    category: "Competitive Programming",
    title: "Codeforces Expert",
    subtitle: "Max Rating 1616",
    description: "Rank 763 in Codeforces Round 1059 (Div. 3)",
    badge: "Expert · 1616",
    badgeColor: "border-blue-500/40 bg-blue-500/15 text-blue-400 shadow-[0_0_12px_rgba(31,138,203,0.3)]",
    icon: SiCodeforces,
    iconColor: "text-[#1F8ACB]",
    iconBg: "bg-blue-500/15 border-blue-500/30",
    counterValue: 1616,
    spotlightColor: "rgba(31, 138, 203, 0.22)",
    customClass: "cf-expert-card",
  },
  {
    category: "Competitive Programming",
    title: "4★ CodeChef",
    subtitle: "Max Rating 1808",
    description: "Global Rank 256 in Starters 186",
    badge: "4-Star · 1808",
    badgeColor: "border-amber-500/40 bg-amber-500/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    icon: SiCodechef,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    counterValue: 1808,
    spotlightColor: "rgba(245, 158, 11, 0.22)",
    customClass: "cc-gold-card",
    starsCount: 4,
  },
  {
    category: "Problem Solving",
    title: "1000+ Problems Solved",
    subtitle: "Consistent Practice",
    description: "Solved across competitive programming platforms and DSA contest archives.",
    badge: "1000+ Solved",
    badgeColor: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]",
    icon: Code2,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    counterValue: 1000,
    counterSuffix: "+",
    spotlightColor: "rgba(52, 211, 153, 0.20)",
  },
  {
    category: "Hackathon",
    title: "Semi-Finalist — Adobe India Hackathon",
    subtitle: "National Level",
    description: "Built and competed in a large-scale engineering challenge with high-impact systems.",
    badge: "Semi-Finalist",
    badgeColor: "border-rose-500/40 bg-rose-500/15 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    icon: Trophy,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/15 border-rose-500/30",
    spotlightColor: "rgba(244, 63, 94, 0.20)",
  },
  {
    category: "Xenia — PICT CSI",
    title: "Runner-up & 3rd Place",
    subtitle: "Collegiate Tech Fest",
    description: "Runner-up in Coders Chamber · 3rd Place in Reverse Coding competition.",
    badge: "Podium Finish",
    badgeColor: "border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]",
    icon: Medal,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/15 border-purple-500/30",
    spotlightColor: "rgba(168, 85, 247, 0.20)",
  },
];

export default function Achievements() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <SpotlightCard
            key={index}
            spotlightColor={item.spotlightColor}
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`card-shine-effect group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-foreground/35 hover:bg-card/75 hover:shadow-2xl hover:shadow-black/30 ${
              item.customClass || ""
            } ${index === 3 || index === 4 ? "sm:col-span-1 lg:col-span-1" : ""}`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-transform ${
                    item.iconBg || "bg-foreground/5 border-border"
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${item.iconColor || "text-foreground"}`} />
                </motion.div>

                {item.badge && (
                  <span
                    className={`badge-glow rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide transition-all ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/45 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-foreground/40" />
                  {item.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                    {item.title}
                  </h3>
                  {/* CodeChef 4-star shimmer effect */}
                  {item.starsCount && (
                    <div className="flex items-center gap-0.5 text-xs select-none">
                      <span className="star-shimmer-1">★</span>
                      <span className="star-shimmer-2">★</span>
                      <span className="star-shimmer-3">★</span>
                      <span className="star-shimmer-4">★</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Counter */}
              {item.counterValue && (
                <div className="mt-3 flex items-baseline gap-2">
                  <AnimatedCounter
                    target={item.counterValue}
                    suffix={item.counterSuffix}
                    className="font-mono text-2xl font-bold tracking-tight text-foreground"
                  />
                  <span className="font-mono text-xs text-foreground/40">rating / count</span>
                </div>
              )}

              {/* Description */}
              <p className="mt-2.5 text-xs leading-relaxed text-foreground/65">
                {item.description}
              </p>
            </div>

            {item.subtitle && (
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <span className="font-mono text-[11px] text-foreground/45 font-medium">
                  {item.subtitle}
                </span>
                <Sparkles className="h-3 w-3 text-foreground/20 transition-colors group-hover:text-foreground/50" />
              </div>
            )}
          </SpotlightCard>
        );
      })}
    </div>
  );
}
