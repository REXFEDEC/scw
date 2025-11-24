import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { scanWebsite, getAISummary } from "@/lib/scanner"

interface ScanResults {
  missing_headers: string[]
  script_tags_found: boolean
  sqli_risk: boolean
  error?: string
}

export async function POST(request: NextRequest) {
  console.log("🚀 [API] Scan endpoint hit")
  
  try {
    const body = await request.json()
    console.log("📦 [API] Request body:", body)
    const { scanId, url } = body

    if (!scanId || !url) {
      console.error("❌ [API] Missing required fields:", { scanId, url })
      return NextResponse.json({ error: "Missing scanId or url" }, { status: 400 })
    }

    // Update scan status to 'scanning'
    console.log("📝 [API] Updating scan status to 'scanning'...")
    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from("scans")
      .update({ status: "scanning" })
      .eq("id", scanId)
    
    if (updateError) {
      console.error("❌ [API] Failed to update scan status:", updateError)
      throw updateError
    }
    console.log("✅ [API] Scan status updated to 'scanning'")

    // Perform the scan synchronously for debugging
    console.log("🔄 [API] Starting scan process...")
    await performScan(scanId, url)
    console.log("✅ [API] Scan completed")

    console.log("🎯 [API] Scan initiated successfully")
    return NextResponse.json({
      success: true,
      message: "Scan started",
    })
  } catch (error: unknown) {
    console.error("💥 [API] Scan API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function performScan(scanId: string, url: string) {
  const startTime = Date.now()
  const supabase = await createClient()

  console.log("🔍 [SCAN] Starting vulnerability scan...")
  console.log("📍 [SCAN] Target URL:", url)
  console.log("🆔 [SCAN] Scan ID:", scanId)

  try {
    // Perform the vulnerability scan
    console.log("⏳ [SCAN] Fetching website content...")
    
    // Add timeout handling for the fetch
    const scanResults = await Promise.race([
      scanWebsite(url),
      new Promise<ScanResults>((_, reject) => 
        setTimeout(() => reject(new Error("Scan timeout after 15 seconds")), 15000)
      )
    ])
    
    console.log("📊 [SCAN] Raw scan results:", scanResults)

    if (scanResults.error) {
      console.error("❌ [SCAN] Scan failed with error:", scanResults.error)
      // Update scan with error status
      await supabase
        .from("scans")
        .update({
          status: "failed",
          scan_duration: Math.round((Date.now() - startTime) / 1000),
        })
        .eq("id", scanId)
      return
    }

    console.log("✅ [SCAN] Scan completed successfully")

    // Get AI summary from Cloudflare Worker (with timeout)
    console.log("🤖 [AI] Generating AI summary...")
    let aiSummary = "AI summary unavailable"
    
    try {
      aiSummary = await Promise.race([
        getAISummary(scanResults),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error("AI summary timeout")), 10000)
        )
      ])
      console.log("📝 [AI] AI summary generated, length:", aiSummary.length)
    } catch (aiError) {
      console.error("❌ [AI] AI summary failed:", aiError)
      aiSummary = "AI summary generation failed due to timeout or network issues."
    }

    // Format vulnerabilities for storage
    const vulnerabilities: Record<string, any> = {}
    console.log("🔧 [SCAN] Processing vulnerabilities...")

    if (scanResults.missing_headers.length > 0) {
      console.log("⚠️ [SCAN] Missing headers found:", scanResults.missing_headers)
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
      console.log("⚠️ [SCAN] Script tags detected - potential XSS risk")
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
      console.log("🚨 [SCAN] SQL injection patterns detected")
      vulnerabilities.sql_injection_patterns = {
        type: "SQL Injection Risk",
        severity: "Critical",
        description: "The URL contains patterns commonly associated with SQL injection attacks.",
        recommendation:
          "Use parameterized queries and prepared statements. Never concatenate user input directly into SQL queries.",
      }
    }

    console.log("📊 [SCAN] Total vulnerabilities found:", Object.keys(vulnerabilities).length)

    // Calculate scan duration
    const scanDuration = Math.round((Date.now() - startTime) / 1000)
    console.log("⏱️ [SCAN] Scan duration:", scanDuration, "seconds")

    // Update scan record with results
    console.log("💾 [SCAN] Updating database with results...")
    const { error: finalUpdateError } = await supabase
      .from("scans")
      .update({
        status: "completed",
        vulnerabilities: Object.keys(vulnerabilities).length > 0 ? vulnerabilities : null,
        ai_summary: aiSummary,
        scan_duration: scanDuration,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scanId)

    if (finalUpdateError) {
      console.error("❌ [SCAN] Failed to update scan with results:", finalUpdateError)
      throw finalUpdateError
    }

    console.log("🎉 [SCAN] Scan completed and results saved successfully!")
  } catch (error: unknown) {
    console.error("💥 [SCAN] Error performing scan:", error)

    // Update scan with error status
    try {
      await supabase
        .from("scans")
        .update({
          status: "failed",
          scan_duration: Math.round((Date.now() - startTime) / 1000),
        })
        .eq("id", scanId)
      
      console.log("❌ [SCAN] Scan marked as failed")
    } catch (updateError) {
      console.error("💥 [SCAN] Failed to update failed status:", updateError)
    }
  }
}
