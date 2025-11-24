"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeAwareImageProps {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
}

export function ThemeAwareImage({ lightSrc, darkSrc, alt, className }: ThemeAwareImageProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return light theme image during SSR/hydration
    return <img src={lightSrc} alt={alt} className={className} />
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const imageSrc = currentTheme === "dark" ? darkSrc : lightSrc

  return <img src={imageSrc} alt={alt} className={className} />
}
