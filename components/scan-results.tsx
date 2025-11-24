"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle, Loader2, Clock, Download } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

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

  useEffect(() => {
    if (!isPolling) return

    const supabase = createClient()
    const pollInterval = setInterval(async () => {
      const { data } = await supabase.from("scans").select("*").eq("id", scan.id).single()

      if (data) {
        setScan(data)
        if (data.status === "completed" || data.status === "failed") {
          setIsPolling(false)
        }
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [isPolling, scan.id])

  const vulnerabilityCount = scan.vulnerabilities ? Object.keys(scan.vulnerabilities).length : 0

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
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

  const handleExport = () => {
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan Results</h1>
          <p className="text-muted-foreground">{scan.url}</p>
        </div>
        <div className="flex items-center gap-4">
          {scan.status === "completed" && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          )}
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {scan.status === "completed" ? (
                <CheckCircle className="w-12 h-12 text-primary" />
              ) : scan.status === "failed" ? (
                <AlertTriangle className="w-12 h-12 text-destructive" />
              ) : (
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
              )}
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {scan.status === "completed" && "Scan Complete"}
                  {scan.status === "scanning" && "Scanning in Progress..."}
                  {scan.status === "pending" && "Scan Pending..."}
                  {scan.status === "failed" && "Scan Failed"}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Started {new Date(scan.created_at).toLocaleString()}
                  </span>
                  {scan.scan_duration && <span>Duration: {scan.scan_duration}s</span>}
                </div>
              </div>
            </div>
            {scan.status === "completed" && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                {vulnerabilityCount} Vulnerabilities Found
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
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{scan.ai_summary}</ReactMarkdown>
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
                      <Badge variant="outline" className={getSeverityColor(vuln.severity || "medium")}>
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
