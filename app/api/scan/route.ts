import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { scanWebsite, getAISummary } from "@/lib/scanner"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scanId, url } = body

    if (!scanId || !url) {
      return NextResponse.json({ error: "Missing scanId or url" }, { status: 400 })
    }

    // Update scan status to 'scanning'
    await supabase.from("scans").update({ status: "scanning" }).eq("id", scanId).eq("user_id", user.id)

    // Perform the scan (this runs in the background)
    performScan(scanId, url, user.id).catch(console.error)

    return NextResponse.json({
      success: true,
      message: "Scan started",
    })
  } catch (error: unknown) {
    console.error("[v0] Scan API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function performScan(scanId: string, url: string, userId: string) {
  const startTime = Date.now()
  const supabase = await createClient()

  try {
    // Perform the vulnerability scan
    const scanResults = await scanWebsite(url)

    if (scanResults.error) {
      // Update scan with error status
      await supabase
        .from("scans")
        .update({
          status: "failed",
          scan_duration: Math.round((Date.now() - startTime) / 1000),
        })
        .eq("id", scanId)
        .eq("user_id", userId)
      return
    }

    // Get AI summary from Cloudflare Worker
    const aiSummary = await getAISummary(scanResults)

    // Format vulnerabilities for storage
    const vulnerabilities: Record<string, any> = {}

    if (scanResults.missing_headers.length > 0) {
      vulnerabilities.missing_security_headers = {
        type: "Missing Security Headers",
        severity: "High",
        description: `The following security headers are missing: ${scanResults.missing_headers.join(", ")}`,
        recommendation:
          "Add these security headers to protect against common attacks like clickjacking, XSS, and protocol downgrade attacks.",
        details: scanResults.missing_headers,
      }
    }

    if (scanResults.script_tags_found) {
      vulnerabilities.potential_xss = {
        type: "Potential XSS Vulnerability",
        severity: "Medium",
        description:
          "Script tags were found in the page content, which may indicate XSS vulnerabilities if user input is not properly sanitized.",
        recommendation:
          "Review all user input handling and ensure proper sanitization and encoding of data before rendering.",
      }
    }

    if (scanResults.sqli_risk) {
      vulnerabilities.sql_injection_patterns = {
        type: "SQL Injection Risk",
        severity: "Critical",
        description: "The URL contains patterns commonly associated with SQL injection attacks.",
        recommendation:
          "Use parameterized queries and prepared statements. Never concatenate user input directly into SQL queries.",
      }
    }

    // Calculate scan duration
    const scanDuration = Math.round((Date.now() - startTime) / 1000)

    // Update scan record with results
    await supabase
      .from("scans")
      .update({
        status: "completed",
        vulnerabilities: Object.keys(vulnerabilities).length > 0 ? vulnerabilities : null,
        ai_summary: aiSummary,
        scan_duration: scanDuration,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scanId)
      .eq("user_id", userId)
  } catch (error: unknown) {
    console.error("[v0] Error performing scan:", error)

    // Update scan with error status
    await supabase
      .from("scans")
      .update({
        status: "failed",
        scan_duration: Math.round((Date.now() - startTime) / 1000),
      })
      .eq("id", scanId)
      .eq("user_id", userId)
  }
}
