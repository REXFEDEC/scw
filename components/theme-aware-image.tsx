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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const resolvedTheme = theme === "system" ? systemTheme : theme
      const newTheme = resolvedTheme === "dark" ? "dark" : "light"
      
      if (newTheme !== currentTheme) {
        setImageLoaded(false)
        setCurrentTheme(newTheme)
      }
    }
  }, [theme, systemTheme, mounted, currentTheme])

  const imageSrc = currentTheme === "dark" ? darkSrc : lightSrc

  if (!mounted) {
    // Return placeholder during SSR
    return (
      <div className={`bg-muted animate-pulse rounded-lg ${className}`} />
    )
  }

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className={`absolute inset-0 bg-muted animate-pulse rounded-lg ${className}`} />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}
