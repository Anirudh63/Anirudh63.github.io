"use client";

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { href: "https://x.com/anirudh_72dhage", icon: <XIcon />, label: "X" },
  { href: "https://github.com/Anirudh63", icon: <Github className="h-4 w-4" />, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/anirudh-dhage-4abb3228a/",
    icon: <Linkedin className="h-4 w-4" />,
    label: "LinkedIn",
  },
  { href: "mailto:anirudhdhage72@gmail.com", icon: <Mail className="h-4 w-4" />, label: "Email" },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8 w-full overflow-hidden border-t border-border/70">
      <div
        className="h-8 border-b border-border/60 opacity-65"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, color-mix(in oklch, var(--border) 85%, transparent) 0, color-mix(in oklch, var(--border) 85%, transparent) 1px, transparent 1px, transparent 8px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

        <div className="relative grid gap-10 md:grid-cols-[1fr_280px] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-500/70">
              You reached the end
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl">
              Still curious?
              <span className="block text-foreground/35">Good. So am I.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="border-l border-border/65 pl-5"
          >
            <p className="text-sm leading-relaxed text-foreground/58">
              Have a strange bug, an ambitious system, or just a good question?
            </p>
            <a
              href="mailto:anirudhdhage72@gmail.com"
              className="link-magnetic group mt-5 inline-flex items-center gap-3 border-b border-foreground/45 pb-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-emerald-400 hover:text-emerald-400 hover:gap-4"
            >
              Send it my way
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <div className="relative mt-14 flex flex-col gap-6 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {socialLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 text-xs text-foreground/48 transition-colors hover:text-foreground"
              >
                {link.icon}
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/30">
            <span>© {year} Anirudh Dhage</span>
            <span>India · Open to internships &amp; full-time roles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
