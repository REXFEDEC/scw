"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [hasShownThisSession, setHasShownThisSession] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Check if user has dismissed the prompt within the last hour
      const dismissedUntil = localStorage.getItem('pwa-prompt-dismissed-until')
      const now = Date.now()
      
      if (!dismissedUntil || parseInt(dismissedUntil) <= now) {
        // Not within dismissal period, show prompt after delay
        setTimeout(() => {
          setShowPrompt(true)
          setHasShownThisSession(true)
        }, 3000)
      }
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === "accepted") {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error("PWA installation failed:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for 1 hour
    const oneHourFromNow = Date.now() + (60 * 60 * 1000)
    localStorage.setItem('pwa-prompt-dismissed-until', oneHourFromNow.toString())
  }

  // Don't show if dismissed within the last hour or if it's iOS (different flow)
  useEffect(() => {
    const dismissedUntil = localStorage.getItem('pwa-prompt-dismissed-until')
    const now = Date.now()
    
    if (dismissedUntil && parseInt(dismissedUntil) > now) {
      // Still within the 1-hour dismissal period
      setShowPrompt(false)
      setHasShownThisSession(true)
    } else if (dismissedUntil && parseInt(dismissedUntil) <= now) {
      // 1-hour period has passed, clear the storage
      localStorage.removeItem('pwa-prompt-dismissed-until')
    }
  }, [])

  if (!showPrompt || isIOS) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent">
      <Card className="max-w-sm mx-auto shadow-2xl border-border animate-in slide-in-from-bottom duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Install ScanWeb</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            Install our app for a faster, more secure experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              size="sm"
            >
              Maybe Later
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            • Works offline • Faster access • Secure & Private
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
