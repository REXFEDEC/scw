"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, Loader2, Clock, Download } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { setupScanNotifications, showScanCompleteNotification } from "@/lib/notifications"

type Scan = {
  id: string
  url: string
  status: string
  vulnerabilities: Record<string, any> | null
  ai_summary: string | null
  scan_duration: number | null
  created_at: string
  completed_at: string | null
}

export function ScanResults({ scan: initialScan }: { scan: Scan }) {
  const [scan, setScan] = useState(initialScan)
  const [isPolling, setIsPolling] = useState(initialScan.status === "pending" || initialScan.status === "scanning")

  console.log("🔄 [RESULTS] ScanResults component mounted")
  console.log("📊 [RESULTS] Initial scan data:", initialScan)
  console.log("⏳ [RESULTS] Polling enabled:", isPolling)

  // Setup notifications on component mount
  useEffect(() => {
    setupScanNotifications()
  }, [])

  useEffect(() => {
    if (!isPolling) {
      console.log("⏹️ [RESULTS] Polling disabled, stopping updates")
      return
    }

    console.log("🔄 [RESULTS] Starting polling for scan updates...")
    const supabase = createClient()
    const pollInterval = setInterval(async () => {
      console.log("🔍 [RESULTS] Polling for scan updates...")
      const { data } = await supabase.from("scans").select("*").eq("id", scan.id).single()

      if (data) {
        console.log("📊 [RESULTS] Scan update received:", {
          id: data.id,
          status: data.status,
          vulnerabilities: data.vulnerabilities ? Object.keys(data.vulnerabilities).length : 0,
          duration: data.scan_duration
        })
        
        setScan(data)
        if (data.status === "completed" || data.status === "failed") {
          console.log("✅ [RESULTS] Scan finished, stopping polling")
          setIsPolling(false)
          
          // Show notification when scan completes
          if (data.status === "completed") {
            const vulnCount = data.vulnerabilities ? Object.keys(data.vulnerabilities).length : 0
            showScanCompleteNotification(window.location.href, vulnCount)
          }
        }
      } else {
        console.warn("⚠️ [RESULTS] No data received from poll")
      }
    }, 3000)

    return () => {
      console.log("🛑 [RESULTS] Cleaning up polling interval")
      clearInterval(pollInterval)
    }
  }, [isPolling, scan.id])

  const vulnerabilityCount = scan.vulnerabilities ? Object.keys(scan.vulnerabilities).length : 0

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-destructive"
      case "high":
        return "text-destructive"
      case "medium":
        return "text-accent"
      case "low":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-accent/10 text-accent border-accent/20"
      case "low":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleExport = () => {
    console.log("📥 [RESULTS] Exporting scan report...")
    const reportData = {
      url: scan.url,
      scanDate: scan.created_at,
      status: scan.status,
      duration: scan.scan_duration,
      vulnerabilities: scan.vulnerabilities,
      aiSummary: scan.ai_summary,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scan-report-${scan.id}.json`
    a.click()
    console.log("✅ [RESULTS] Report exported successfully")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan Results</h1>
          <p className="text-muted-foreground">{scan.url}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {scan.status === "completed" && (
            <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Export Report
            </Button>
          )}
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {scan.status === "completed" ? (
                <CheckCircle className="w-12 h-12 text-primary" />
              ) : scan.status === "scanning" ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : scan.status === "failed" ? (
                <AlertTriangle className="w-12 h-12 text-destructive" />
              ) : (
                <Clock className="w-12 h-12 text-muted-foreground" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-foreground capitalize">{scan.status}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Started {new Date(scan.created_at).toLocaleString()}
                  </span>
                  {scan.scan_duration && <span>Duration: {scan.scan_duration}s</span>}
                </div>
              </div>
            </div>
            {scan.status === "completed" && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-base sm:text-lg px-3 py-1 sm:px-4 sm:py-2 whitespace-nowrap">
                <span className="text-sm sm:text-base">{vulnerabilityCount}</span>
                <span className="hidden sm:inline ml-1">Vulnerabilities Found</span>
                <span className="sm:hidden ml-1">Found</span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {scan.status === "completed" && scan.ai_summary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              AI-Powered Security Summary
            </CardTitle>
            <CardDescription>Intelligent analysis and recommendations for your security posture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert break-words">
              <ReactMarkdown 
                components={{
                  p: ({children}: any) => <p className="mb-4 break-words">{children}</p>,
                  ul: ({children}: any) => <ul className="list-disc pl-6 mb-4 break-words">{children}</ul>,
                  ol: ({children}: any) => <ol className="list-decimal pl-6 mb-4 break-words">{children}</ol>,
                  li: ({children}: any) => <li className="mb-2 break-words">{children}</li>,
                  h1: ({children}: any) => <h1 className="text-2xl font-bold mb-4 break-words">{children}</h1>,
                  h2: ({children}: any) => <h2 className="text-xl font-bold mb-3 break-words">{children}</h2>,
                  h3: ({children}: any) => <h3 className="text-lg font-bold mb-2 break-words">{children}</h3>,
                  code: ({children, inline}: any) => 
                    inline ? 
                      <code className="bg-muted px-1 py-0.5 rounded text-sm break-all">{children}</code> : 
                      <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm"><code>{children}</code></pre>,
                  blockquote: ({children}: any) => <blockquote className="border-l-4 border-primary pl-4 italic break-words">{children}</blockquote>,
                }}
              >
                {scan.ai_summary}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {scan.status === "completed" && scan.vulnerabilities && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Vulnerabilities</CardTitle>
            <CardDescription>Detailed breakdown of security issues found during the scan</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(scan.vulnerabilities).length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Vulnerabilities Found</h3>
                <p className="text-muted-foreground">Great news! Your website passed all security checks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(scan.vulnerabilities).map(([key, vuln]: [string, any]) => (
                  <div key={key} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${getSeverityColor(vuln.severity || "medium")}`} />
                        <h4 className="font-semibold text-foreground">{vuln.type || key}</h4>
                      </div>
                      <Badge variant="outline" className={getSeverityBadgeColor(vuln.severity || "medium")}>
                        {vuln.severity || "Medium"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {vuln.description || "No description available"}
                    </p>
                    {vuln.recommendation && (
                      <div className="mt-3 p-3 bg-secondary/50 rounded-md">
                        <p className="text-sm font-medium text-foreground mb-1">Recommendation:</p>
                        <p className="text-sm text-muted-foreground">{vuln.recommendation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(scan.status === "scanning" || scan.status === "pending") && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Scanning Your Website...</h3>
              <p className="text-muted-foreground">
                This may take a few minutes. Results will appear automatically when ready.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
