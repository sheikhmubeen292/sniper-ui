"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-zinc-800 bg-black/50 backdrop-blur-sm hover:bg-zinc-900 transition-all duration-200 shadow-md shadow-pink-900/10 dark:border-zinc-700 dark:bg-white/5 dark:hover:bg-white/10"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-pink-400" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-pink-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

