interface ScanResults {
  missing_headers: string[]
  script_tags_found: boolean
  sqli_risk: boolean
  error?: string
}

export async function scanWebsite(url: string): Promise<ScanResults> {
  console.log("🌐 [SCANNER] Starting website scan for:", url)
  
  const results: ScanResults = {
    missing_headers: [],
    script_tags_found: false,
    sqli_risk: false,
  }

  try {
    console.log("⏳ [SCANNER] Making HTTP request...")
    // Perform GET request to the target URL
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "ScanWeb Security Scanner/1.0",
      },
      // Set timeout
      signal: AbortSignal.timeout(10000),
    })

    console.log("📡 [SCANNER] Response received - Status:", response.status)
    const headers = response.headers
    const html = await response.text()
    console.log("📄 [SCANNER] HTML content length:", html.length, "characters")

    // Check for missing security headers
    const headersToCheck = ["x-frame-options", "content-security-policy", "strict-transport-security"]
    console.log("🔍 [SCANNER] Checking security headers...")

    results.missing_headers = headersToCheck.filter((header) => !headers.has(header))
    
    console.log("📋 [SCANNER] Headers found:", {
      "x-frame-options": headers.has("x-frame-options"),
      "content-security-policy": headers.has("content-security-policy"), 
      "strict-transport-security": headers.has("strict-transport-security")
    })
    console.log("⚠️ [SCANNER] Missing headers:", results.missing_headers)

    // Naive XSS check - look for script tags
    console.log("🔍 [SCANNER] Checking for script tags...")
    results.script_tags_found = html.toLowerCase().includes("<script>")
    console.log("📝 [SCANNER] Script tags found:", results.script_tags_found)

    // Naive SQLi check - look for common SQL injection patterns in URL
    console.log("🔍 [SCANNER] Checking for SQL injection patterns...")
    const sqlPatterns = ["'", '"', "--", "/*", "*/"]
    results.sqli_risk = sqlPatterns.some((pattern) => url.includes(pattern))
    console.log("💉 [SCANNER] SQL injection risk:", results.sqli_risk)

    console.log("✅ [SCANNER] Scan completed successfully")
    console.log("📊 [SCANNER] Final results:", results)
    
    return results
  } catch (error: unknown) {
    console.error("❌ [SCANNER] Scan failed:", error)
    return {
      missing_headers: [],
      script_tags_found: false,
      sqli_risk: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getAISummary(results: ScanResults): Promise<string> {
  console.log("🤖 [AI] Starting AI summary generation...")
  console.log("📊 [AI] Input results:", results)

  try {
    console.log("📡 [AI] Calling Cloudflare Worker endpoint...")
    const response = await fetch("https://vulscan.sameermann5335.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ results }),
    })

    console.log("📡 [AI] Worker response status:", response.status)

    if (!response.ok) {
      console.error("❌ [AI] Worker responded with error:", response.status)
      throw new Error(`Worker responded with status ${response.status}`)
    }

    const data = await response.json()
    console.log("📦 [AI] Worker response data:", data)

    // The worker returns { summary, recommendations }
    // We'll format it as markdown
    let markdown = ""

    if (data.summary) {
      console.log("📝 [AI] Summary received, length:", data.summary.length)
      markdown = data.summary
    }

    if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
      console.log("📝 [AI] Recommendations received:", data.recommendations.length, "items")
      markdown += "\n\n## Recommendations\n\n"
      data.recommendations.forEach((rec: string) => {
        markdown += `- ${rec}\n`
      })
    }

    const finalMarkdown = markdown || "AI summary generated successfully."
    console.log("✅ [AI] Final markdown generated, length:", finalMarkdown.length)
    return finalMarkdown
  } catch (error: unknown) {
    console.error("❌ [AI] Error getting AI summary:", error)
    return "Unable to generate AI summary at this time. Please try again later."
  }
}
