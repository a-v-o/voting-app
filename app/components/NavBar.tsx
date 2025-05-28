"use client";

import { BotIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [counter, setCounter] = useState(10);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function startCounter() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setCounter((prevCounter) => Math.max(prevCounter - 1, 0));
    }, 200);
  }

  function stopCounter() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePress() {
    startCounter();
  }

  function handleRelease() {
    stopCounter();

    if (counter > 0) {
      setTheme(theme == "dark" ? "light" : "dark");
    }

    setCounter(10);
  }

  function handleClick() {
    setCounter(10);
  }

  return (
    <div className="transition-all">
      <Button
        variant="outline"
        size="icon"
        className={counter <= 0 ? "scale-0" : "scale-100 transition-all"}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={stopCounter}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button
        className={counter <= 0 ? "scale-100 transition-all" : "scale-0"}
        asChild
        variant="outline"
        onClick={handleClick}
      >
        <Link href="/becomeSupreme" className="w-5 h-5">
          <BotIcon />
        </Link>
      </Button>
    </div>
  );
}
