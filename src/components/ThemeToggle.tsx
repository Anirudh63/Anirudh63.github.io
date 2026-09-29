"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[50px] h-[26px] rounded-full bg-neutral-800 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="theme-checkbox"
        className="sr-only"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <label
        htmlFor="theme-checkbox"
        className="relative flex items-center justify-between w-[50px] h-[26px] bg-neutral-800 dark:bg-neutral-700 rounded-full p-[5px] cursor-pointer transition-colors"
      >
        {/* Moon Icon */}
        <svg
          className="w-3 h-3 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>

        {/* Sun Icon */}
        <svg
          className="w-3 h-3 text-orange-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Ball */}
        <span
          className={`absolute w-[22px] h-[22px] bg-white rounded-full transition-transform duration-200 ease-linear ${
            isDark ? "translate-x-[24px]" : "translate-x-0"
          }`}
          style={{ left: "2px", top: "2px" }}
        />
      </label>
    </div>
  );
}
