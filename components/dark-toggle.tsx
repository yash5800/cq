"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DarkToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid hydration mismatch — render nothing until mounted
    return <div aria-hidden className="w-10 h-10" />
  }

  const activeTheme = theme === "system" ? systemTheme : theme

  const toggle = () => {
    setTheme(activeTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        variant="outline"
        onClick={toggle}
        aria-label={activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={activeTheme === "dark" ? "Light" : "Dark"}
      >
        {activeTheme === "dark" ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
      </Button>
    </div>
  )
}
