"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SiLeetcode, SiCodeforces } from "react-icons/si";
import {
  ArrowUpRight,
  Award,
  Flame,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import SpotlightCard from "@/components/SpotlightCard";
import cachedCodingStats from "@/data/coding-stats.json";

interface CodingStatsData {
  leetcode: {
    username: string;
    profileUrl: string;
    totalSolved: number;
    totalQuestions: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    streak: number;
    totalActiveDays: number;
    calendar: Record<string, number>;
  };
  codeforces: {
    handle: string;
    profileUrl: string;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
    organization: string;
    city: string;
    country: string;
    contribution: number;
    calendar: Record<string, number>;
  };
  combinedCalendar: Record<string, number>;
}

const fallbackStats: CodingStatsData = {
  leetcode: {
    username: "anirudh_dhage",
    profileUrl: "https://leetcode.com/u/anirudh_dhage/",
    totalSolved: 695,
    totalQuestions: 3400,
    easySolved: 211,
    mediumSolved: 417,
    hardSolved: 67,
    ranking: 100006,
    streak: 25,
    totalActiveDays: 153,
    calendar: {},
  },
  codeforces: {
    handle: "DestructorX",
    profileUrl: "https://codeforces.com/profile/DestructorX",
    rating: 1616,
    maxRating: 1616,
    rank: "expert",
    maxRank: "expert",
    organization: "Jiangly Fan Club",
    city: "Pune",
    country: "India",
    contribution: 8,
    calendar: {},
  },
  combinedCalendar: {},
};

const defaultStats: CodingStatsData = (cachedCodingStats as unknown as CodingStatsData) || fallbackStats;

type CalendarMode = "combined" | "leetcode" | "codeforces";

export default function CodingActivity() {
  const [stats, setStats] = useState<CodingStatsData>(defaultStats);
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("combined");

  useEffect(() => {
    async function fetchLatestStats() {
      try {
        let res = await fetch("/api/coding-stats");
        if (!res.ok) {
          res = await fetch("/data/coding-stats.json");
        }
        if (res.ok) {
          const data: CodingStatsData = await res.json();
          if (data?.leetcode && data?.codeforces) {
            setStats((prev) => {
              const hasNewCombined = data.combinedCalendar && Object.keys(data.combinedCalendar).length > 0;
              const hasNewLc = data.leetcode.calendar && Object.keys(data.leetcode.calendar).length > 0;
              const hasNewCf = data.codeforces.calendar && Object.keys(data.codeforces.calendar).length > 0;

              return {
                ...data,
                combinedCalendar: hasNewCombined ? data.combinedCalendar : prev.combinedCalendar,
                leetcode: {
                  ...data.leetcode,
                  calendar: hasNewLc ? data.leetcode.calendar : prev.leetcode.calendar,
                },
                codeforces: {
                  ...data.codeforces,
                  calendar: hasNewCf ? data.codeforces.calendar : prev.codeforces.calendar,
                },
              };
            });
          }
        }
      } catch {
        // Fallback remains active
      } finally {
        setLoading(false);
      }
    }

    fetchLatestStats();
  }, []);

  const { leetcode, codeforces, combinedCalendar } = stats;

  const activeCalendar = useMemo(() => {
    if (calendarMode === "leetcode") return leetcode.calendar || {};
    if (calendarMode === "codeforces") return codeforces.calendar || {};
    return combinedCalendar || {};
  }, [calendarMode, leetcode.calendar, codeforces.calendar, combinedCalendar]);

  // Generate 52/53 weeks of days for the selected year
  const calendarGrid = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const startDayOfWeek = startDate.getDay(); // 0 = Sunday
    const startOffset = (startDayOfWeek + 6) % 7; // Monday = 0
    const alignedStart = new Date(startDate);
    alignedStart.setDate(alignedStart.getDate() - startOffset);

    const days: Array<{
      dateStr: string;
      displayDate: string;
      count: number;
      level: number;
      isCurrentYear: boolean;
      weekIndex: number;
      dayOfWeek: number;
    }> = [];

    const current = new Date(alignedStart);
    let weekIndex = 0;

    let maxDailyCount = 1;
    for (const [d, count] of Object.entries(activeCalendar)) {
      if (d.startsWith(String(selectedYear)) && count > maxDailyCount) {
        maxDailyCount = count;
      }
    }

    while (current <= endDate || current.getDay() !== 1) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const isCurrentYear = year === selectedYear;
      const count = isCurrentYear ? activeCalendar[dateStr] || 0 : 0;

      let level = 0;
      if (count > 0) {
        if (count >= 10) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 2) level = 2;
        else level = 1;
      }

      const dayOfWeek = (current.getDay() + 6) % 7; // 0 = Mon, 6 = Sun

      days.push({
        dateStr,
        displayDate: current.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        count,
        level,
        isCurrentYear,
        weekIndex,
        dayOfWeek,
      });

      if (dayOfWeek === 6) {
        weekIndex++;
      }

      current.setDate(current.getDate() + 1);
      if (current.getFullYear() > selectedYear && current.getDay() === 1) {
        break;
      }
    }

    return days;
  }, [selectedYear, activeCalendar]);

  // Compute total year submissions
  const totalSubmissionsInYear = useMemo(() => {
    let sum = 0;
    for (const [dateStr, count] of Object.entries(activeCalendar)) {
      if (dateStr.startsWith(String(selectedYear))) {
        sum += count;
      }
    }
    return sum;
  }, [selectedYear, activeCalendar]);

  const monthLabels = [
    { label: "Jan", week: 0 },
    { label: "Feb", week: 4 },
    { label: "Mar", week: 8 },
    { label: "Apr", week: 13 },
    { label: "May", week: 17 },
    { label: "Jun", week: 21 },
    { label: "Jul", week: 26 },
    { label: "Aug", week: 30 },
    { label: "Sep", week: 35 },
    { label: "Oct", week: 39 },
    { label: "Nov", week: 43 },
    { label: "Dec", week: 48 },
  ];

  // Palette scale based on active mode
  const getCellColor = (level: number) => {
    if (level === 0) return "bg-foreground/[0.06] dark:bg-white/[0.04]";
    if (calendarMode === "codeforces") {
      switch (level) {
        case 1:
          return "bg-blue-900/60 text-blue-100";
        case 2:
          return "bg-blue-700 text-white";
        case 3:
          return "bg-blue-500 text-white";
        case 4:
          return "bg-blue-400 text-white shadow-[0_0_8px_rgba(96,165,250,0.5)]";
        default:
          return "bg-blue-500";
      }
    }
    if (calendarMode === "leetcode") {
      switch (level) {
        case 1:
          return "bg-amber-950/60 text-amber-100";
        case 2:
          return "bg-amber-700 text-white";
        case 3:
          return "bg-amber-500 text-white";
        case 4:
          return "bg-amber-400 text-white shadow-[0_0_8px_rgba(251,191,36,0.5)]";
        default:
          return "bg-amber-500";
      }
    }
    // Combined / Green GitHub style
    switch (level) {
      case 1:
        return "bg-emerald-950/80 text-emerald-100";
      case 2:
        return "bg-emerald-700 text-white";
      case 3:
        return "bg-emerald-500 text-white";
      case 4:
        return "bg-emerald-400 text-white shadow-[0_0_8px_rgba(52,211,153,0.5)]";
      default:
        return "bg-emerald-500";
    }
  };

  const totalLc = leetcode.totalSolved || 1;
  const easyPct = ((leetcode.easySolved || 0) / totalLc) * 100;
  const medPct = ((leetcode.mediumSolved || 0) / totalLc) * 100;
  const hardPct = ((leetcode.hardSolved || 0) / totalLc) * 100;

  // Codeforces rating relative to Expert tier (1600 - 1900 CM)
  const cfProgressPct = Math.min(
    100,
    Math.max(10, (((codeforces.rating || 1616) - 1400) / (1900 - 1400)) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LeetCode Card with Mouse-Tracking Spotlight */}
        <SpotlightCard
          spotlightColor="rgba(255, 161, 22, 0.16)"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.45 }}
          className="lc-amber-card card-shine-effect group relative rounded-xl border border-border/70 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:bg-card/85 hover:shadow-2xl hover:shadow-black/25"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15 text-[#FFA116] shadow-sm"
                >
                  <SiLeetcode className="h-6 w-6" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground text-base tracking-tight flex items-center gap-1.5">
                    LeetCode
                  </h3>
                  <p className="font-mono text-xs text-foreground/50">@{leetcode.username}</p>
                </div>
              </div>

              <a
                href={leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-magnetic inline-flex items-center gap-1 rounded-full border border-border/80 bg-foreground/[0.04] px-3 py-1 text-xs font-medium text-foreground/75 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
              >
                Profile
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            {/* Big metric with Count-up */}
            <div className="mt-6 flex items-baseline justify-between border-b border-border/50 pb-5">
              <div>
                <AnimatedCounter
                  target={leetcode.totalSolved}
                  className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                />
                <span className="ml-2 text-xs font-medium text-foreground/50">Problems Solved</span>
              </div>
            </div>

            {/* Animated Difficulty Breakdown with Ratio Bar */}
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/50 bg-foreground/[0.02] p-3 text-center transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.05]">
                  <p className="text-[11px] font-medium text-emerald-400">Easy</p>
                  <AnimatedCounter
                    target={leetcode.easySolved}
                    className="mt-1 font-mono text-lg font-semibold text-foreground"
                  />
                </div>

                <div className="rounded-lg border border-border/50 bg-foreground/[0.02] p-3 text-center transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.05]">
                  <p className="text-[11px] font-medium text-amber-400">Medium</p>
                  <AnimatedCounter
                    target={leetcode.mediumSolved}
                    className="mt-1 font-mono text-lg font-semibold text-foreground"
                  />
                </div>

                <div className="rounded-lg border border-border/50 bg-foreground/[0.02] p-3 text-center transition-colors hover:border-rose-500/30 hover:bg-rose-500/[0.05]">
                  <p className="text-[11px] font-medium text-rose-400">Hard</p>
                  <AnimatedCounter
                    target={leetcode.hardSolved}
                    className="mt-1 font-mono text-lg font-semibold text-foreground"
                  />
                </div>
              </div>

              {/* Animated Difficulty Proportion Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-foreground/45">
                  <span>Solved Ratio</span>
                  <span>{easyPct.toFixed(0)}% Easy · {medPct.toFixed(0)}% Med · {hardPct.toFixed(0)}% Hard</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06] flex gap-0.5 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${easyPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)] progress-bar-shimmer"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${medPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] progress-bar-shimmer"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${hardPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] progress-bar-shimmer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Extra Pills with Flame Animation */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 font-mono text-xs text-foreground/55">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-amber-300">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-flame" />
              {leetcode.totalActiveDays} Active Days
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-foreground/[0.03] px-2.5 py-1">
              <Award className="h-3.5 w-3.5 text-blue-400" />
              Global Rank #{leetcode.ranking.toLocaleString()}
            </span>
          </div>
        </SpotlightCard>

        {/* Codeforces Card with Mouse-Tracking Spotlight */}
        <SpotlightCard
          spotlightColor="rgba(31, 138, 203, 0.20)"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="cf-expert-card card-shine-effect group relative rounded-xl border border-border/70 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-card/85 hover:shadow-2xl hover:shadow-black/25"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/15 text-[#1F8ACB] shadow-sm"
                >
                  <SiCodeforces className="h-6 w-6" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground text-base tracking-tight flex items-center gap-1.5">
                    Codeforces
                  </h3>
                  <p className="font-mono text-xs text-foreground/50">@{codeforces.handle}</p>
                </div>
              </div>

              <a
                href={codeforces.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-magnetic inline-flex items-center gap-1 rounded-full border border-border/80 bg-foreground/[0.04] px-3 py-1 text-xs font-medium text-foreground/75 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
              >
                Profile
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            {/* Big metric with Count-up */}
            <div className="mt-6 flex items-baseline justify-between border-b border-border/50 pb-5">
              <div>
                <AnimatedCounter
                  target={codeforces.rating}
                  className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                />
                <span className="ml-2 text-xs font-medium text-foreground/50">Current Rating</span>
              </div>

              <div className="badge-glow flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-blue-500/20 px-3 py-1 text-xs font-semibold capitalize text-blue-400 shadow-[0_0_12px_rgba(31,138,203,0.35)]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{codeforces.rank}</span>
              </div>
            </div>

            {/* Rating Breakdown & Stats */}
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-foreground/[0.02] p-3 transition-colors hover:border-blue-500/30 hover:bg-blue-500/[0.05]">
                  <p className="text-[11px] font-medium text-foreground/50">Max Rating</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <AnimatedCounter
                      target={codeforces.maxRating}
                      className="font-mono text-lg font-semibold text-blue-400"
                    />
                    <span className="text-xs font-normal capitalize text-foreground/50">
                      ({codeforces.maxRank})
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-foreground/[0.02] p-3 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.05]">
                  <p className="text-[11px] font-medium text-foreground/50">Contribution</p>
                  <AnimatedCounter
                    target={codeforces.contribution}
                    prefix="+"
                    className="mt-1 font-mono text-lg font-semibold text-emerald-400"
                  />
                </div>
              </div>

              {/* Codeforces Expert Tier Progression Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-foreground/45">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Zap className="h-3 w-3" />
                    Expert Tier
                  </span>
                  <span>{codeforces.rating} / 1900 to Candidate Master</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06] p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${cfProgressPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(31,138,203,0.6)] progress-bar-shimmer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Extra details */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 font-mono text-xs text-foreground/55">
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-foreground/[0.03] px-2.5 py-1">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              {codeforces.organization}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-foreground/[0.03] px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              {codeforces.city}, {codeforces.country}
            </span>
          </div>
        </SpotlightCard>
      </div>

      {/* Heatmap Activity Section with Spotlight */}
      <SpotlightCard
        spotlightColor="rgba(52, 211, 153, 0.10)"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="card-shine-effect rounded-xl border border-border/70 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-foreground/25 hover:bg-card/75 hover:shadow-xl hover:shadow-black/20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
          <div>
            <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/60" />
              Submission Heatmap
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-foreground/45">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    loading ? "bg-amber-400 animate-ping" : "bg-emerald-400 status-dot-pulse"
                  }`}
                />
                {loading ? "syncing..." : "live"}
              </span>
            </h3>
            <p className="font-mono text-xs text-foreground/50 mt-1 flex items-center gap-1">
              <AnimatedCounter
                target={totalSubmissionsInYear}
                className="font-semibold text-foreground"
              />{" "}
              submissions in {selectedYear}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-foreground/[0.03] p-1">
            <button
              type="button"
              onClick={() => setCalendarMode("combined")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                calendarMode === "combined"
                  ? "bg-foreground text-background shadow-md scale-105"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              All Activity
            </button>
            <button
              type="button"
              onClick={() => setCalendarMode("leetcode")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                calendarMode === "leetcode"
                  ? "bg-[#FFA116] text-black font-semibold shadow-md shadow-amber-500/30 scale-105"
                  : "text-foreground/60 hover:text-foreground hover:text-amber-400"
              }`}
            >
              LeetCode
            </button>
            <button
              type="button"
              onClick={() => setCalendarMode("codeforces")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                calendarMode === "codeforces"
                  ? "bg-[#1F8ACB] text-white font-semibold shadow-md shadow-blue-500/30 scale-105"
                  : "text-foreground/60 hover:text-foreground hover:text-blue-400"
              }`}
            >
              Codeforces
            </button>
          </div>
        </div>

        {/* Calendar Heatmap Grid */}
        <TooltipProvider delayDuration={80}>
          <div className="mt-6 overflow-x-auto pb-2">
            <div className="min-w-[780px]">
              {/* Month Labels */}
              <div className="mb-2 flex text-[10px] font-mono text-foreground/40 pl-8">
                {monthLabels.map((m) => (
                  <span key={m.label} style={{ width: `${100 / 12}%` }}>
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Grid with Day Labels */}
              <div className="flex gap-2">
                {/* Day of Week Labels */}
                <div className="flex flex-col justify-between py-0.5 text-[9px] font-mono text-foreground/35 pr-1 select-none">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* 53 Columns x 7 Rows Grid with Hover Micro-Interactions */}
                <div className="grid grid-flow-col grid-rows-7 gap-[3px] flex-1">
                  {calendarGrid.map((day, idx) => (
                    <Tooltip key={`${day.dateStr}-${idx}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-[11px] w-[11px] rounded-[2px] transition-all duration-200 cursor-pointer ${
                            day.isCurrentYear
                              ? getCellColor(day.level)
                              : "opacity-0 pointer-events-none"
                          } hover:scale-150 hover:z-20 hover:ring-2 hover:ring-foreground/50 hover:shadow-lg`}
                        />
                      </TooltipTrigger>
                      {day.isCurrentYear && (
                        <TooltipContent
                          side="top"
                          className="border border-border/80 bg-popover/95 px-2.5 py-1 text-xs text-popover-foreground shadow-xl backdrop-blur-md"
                        >
                          <span className="font-semibold text-foreground">
                            {day.count} {day.count === 1 ? "submission" : "submissions"}
                          </span>{" "}
                          on {day.displayDate}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Heatmap Footer Legend */}
              <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40 text-xs font-mono text-foreground/45">
                <span>
                  {calendarMode === "combined"
                    ? "Combined LeetCode & Codeforces"
                    : calendarMode === "leetcode"
                    ? "LeetCode Submissions"
                    : "Codeforces Submissions"}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">Less</span>
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-foreground/[0.06] dark:bg-white/[0.04]" />
                    <span className={`h-2.5 w-2.5 rounded-[2px] ${getCellColor(1)}`} />
                    <span className={`h-2.5 w-2.5 rounded-[2px] ${getCellColor(2)}`} />
                    <span className={`h-2.5 w-2.5 rounded-[2px] ${getCellColor(3)}`} />
                    <span className={`h-2.5 w-2.5 rounded-[2px] ${getCellColor(4)}`} />
                  </div>
                  <span className="text-[10px]">More</span>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Year Selector Buttons */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-border/40 pt-4">
          {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
            <Button
              key={year}
              size="sm"
              variant={selectedYear === year ? "default" : "ghost"}
              className={`h-7 px-3 rounded-full text-[0.7rem] font-medium tracking-wide transition-all ${
                selectedYear === year
                  ? "shadow-sm scale-105"
                  : "bg-foreground/0 hover:bg-foreground/10 text-foreground/60"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
