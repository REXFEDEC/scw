"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2 } from "lucide-react"

export default function ScanPage() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsScanning(true)
    setError(null)

    console.log("🚀 Starting scan process...")
    console.log("📍 URL submitted:", url)

    try {
      const supabase = createClient()
      console.log("🔐 Getting authenticated user...")

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error("❌ No authenticated user found")
        throw new Error("Not authenticated")
      }
      console.log("✅ User authenticated:", user.id)

      // Validate URL
      let scanUrl = url.trim()
      if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
        scanUrl = "https://" + scanUrl
      }
      console.log("🔗 Validated scan URL:", scanUrl)

      // Create scan record
      console.log("💾 Creating scan record in database...")
      const { data: scan, error: insertError } = await supabase
        .from("scans")
        .insert({
          user_id: user.id,
          url: scanUrl,
          status: "pending",
        })
        .select()
        .single()

      if (insertError) {
        console.error("❌ Database insert error:", insertError)
        throw insertError
      }
      console.log("✅ Scan record created:", scan.id)

      // Trigger the scan via API route
      console.log("📡 Calling scan API endpoint...")
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: scan.id, url: scanUrl }),
      })

      console.log("📡 API response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API error response:", errorText)
        throw new Error(`Failed to start scan: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("✅ API response:", responseData)

      // Redirect to scan results page
      console.log("🔄 Redirecting to scan results:", `/scan/${scan.id}`)
      router.push(`/scan/${scan.id}`)
    } catch (error: unknown) {
      console.error("💥 Scan initiation failed:", error)
      setError(error instanceof Error ? error.message : "Failed to start scan")
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">New Vulnerability Scan</h1>
          <p className="text-muted-foreground">Enter a website URL to begin comprehensive security analysis</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scan Configuration</CardTitle>
            <CardDescription>We'll scan for XSS, SQL injection, CSRF, and other common vulnerabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="example.com or https://example.com"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isScanning}
                  />
                  <p className="text-sm text-muted-foreground">Enter the domain or full URL you want to scan</p>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" size="lg" disabled={isScanning} className="w-full">
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Starting Scan...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What We Scan For</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Cross-Site Scripting (XSS) vulnerabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>SQL Injection attack vectors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Cross-Site Request Forgery (CSRF) protections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Security header misconfigurations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Outdated software and known CVEs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
