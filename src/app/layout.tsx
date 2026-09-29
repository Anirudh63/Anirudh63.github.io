// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Import the provider
import { Analytics } from "@vercel/analytics/next";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import ParticleBackground from "@/components/ParticleBackground";
import TerminalHud from "@/components/TerminalHud";
import ScrollProgress from "@/components/ScrollProgress";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anirudh Dhage",
  description: "Always learning, always building.",
  icons:{
    icon:"/Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundWrapper>
            <ParticleBackground />
            <ScrollProgress />
            <TerminalHud />
            {children}
            <Analytics />
          </BackgroundWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}