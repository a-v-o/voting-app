"use client";

import { BotIcon, HomeIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [action, setAction] = useState("");
  const timerRef = useRef<NodeJS.Timeout>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function startTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, 2000);
  }

  function handleOnMouseDown() {
    startTimer();
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current as NodeJS.Timeout);
  }

  function handleOnTouchStart() {
    startTimer();
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current as NodeJS.Timeout);
  }

  function handleClick() {
    setAction("click");
  }

  return (
    <nav className="h-16 w-content px-6 absolute top-0 right-0 justify-end gap-4 flex shrink-0 items-center z-10">
      <Button variant="outline" asChild className="px-2" size="icon">
        <Link href="/" className="h-5 w-5">
          <HomeIcon />
        </Link>
      </Button>
      <div className="flex transition-all relative select-none">
        <Button
          variant="outline"
          size="icon"
          className={action == "longpress" ? "hidden" : "flex transition-all"}
          onMouseDown={handleOnMouseDown}
          onMouseUp={handleOnMouseUp}
          onTouchStart={handleOnTouchStart}
          onTouchEnd={handleOnTouchEnd}
          onClick={() => {
            if (isLongPress.current) return;
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button
          size="icon"
          className={
            action == "longpress"
              ? "flex scale-100 transition-all"
              : "hidden scale-0"
          }
          asChild
          variant="outline"
          onClick={handleClick}
        >
          <Link href="/becomeSupreme" className="w-5 h-5">
            <BotIcon />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
