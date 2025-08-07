import { createContext, useContext, useEffect, useState } from "react"

// Create context for theme management
const ThemeContext = createContext(undefined)

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-theme-preference" }) {
  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem(storageKey)
      return storedTheme || defaultTheme
    }
    return defaultTheme
  })

  // Update theme class on document element
  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Apply appropriate theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  // Function to update theme
  const setThemeValue = (newTheme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }

  // Create context value
  const value = {
    theme,
    setTheme: setThemeValue,
    // Helper functions for theme toggling
    toggleTheme: () => {
      setThemeValue(theme === "dark" ? "light" : "dark")
    },
    isDark: theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

// Theme toggle component example
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-zinc-200 dark:bg-zinc-800"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  )
}
