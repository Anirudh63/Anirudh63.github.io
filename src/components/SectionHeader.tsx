"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  kicker: string;
  heading: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({
  kicker,
  heading,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Kicker + Expanding Line Animation */}
      <div className="flex items-center gap-3">
        <motion.p
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="section-kicker select-none"
        >
          {kicker}
        </motion.p>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="h-[1px] w-16 origin-left"
          style={{
            background: "linear-gradient(90deg, oklch(0.65 0.18 260 / 0.6), transparent)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Main Heading with blur-to-sharp reveal */}
      <motion.h2
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="section-heading tracking-tight"
      >
        {heading}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-sm leading-relaxed text-foreground/55"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
