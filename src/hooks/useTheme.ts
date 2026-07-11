import { useEffect } from 'react'
import { useEditorStore, type Theme } from '../store/editorStore'

export function useTheme() {
  const theme = useEditorStore((s) => s.theme)
  const setTheme = useEditorStore((s) => s.setTheme)

  useEffect(() => {
    const root = document.documentElement

    // Add transition class before changing theme
    root.classList.add('theme-transition')

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Remove transition class after animation completes to avoid
    // interfering with other transitions
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 350)

    return () => clearTimeout(timer)
  }, [theme])

  // Detect system theme on first load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = localStorage.getItem('editor-theme') as Theme | null
    setTheme(stored ?? (prefersDark ? 'dark' : 'light'))
  }, [setTheme])

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('editor-theme', theme)
  }, [theme])
}
