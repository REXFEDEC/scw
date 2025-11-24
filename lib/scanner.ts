interface ScanResults {
  missing_headers: string[]
  script_tags_found: boolean
  sqli_risk: boolean
  info_disclosure: {
    server_header: boolean
    powered_by: boolean
    php_version: boolean
    asp_version: boolean
  }
  error?: string
}

export async function scanWebsite(url: string): Promise<ScanResults> {
  console.log("🌐 [SCANNER] Starting website scan for:", url)
  
  const results: ScanResults = {
    missing_headers: [],
    script_tags_found: false,
    sqli_risk: false,
    info_disclosure: {
      server_header: false,
      powered_by: false,
      php_version: false,
      asp_version: false
    }
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
    const headersToCheck = [
      "x-frame-options", 
      "content-security-policy", 
      "strict-transport-security",
      "x-content-type-options",      // Prevents MIME sniffing
      "referrer-policy",             // Controls referrer information
      "permissions-policy",          // Controls browser features
      "cross-origin-embedder-policy"  // Controls cross-origin requests
    ]
    console.log("🔍 [SCANNER] Checking security headers...")

    results.missing_headers = headersToCheck.filter((header) => !headers.has(header))
    
    console.log("📋 [SCANNER] Headers found:", {
      "x-frame-options": headers.has("x-frame-options"),
      "content-security-policy": headers.has("content-security-policy"), 
      "strict-transport-security": headers.has("strict-transport-security")
    })
    console.log("⚠️ [SCANNER] Missing headers:", results.missing_headers)

    // Enhanced XSS check - look for various XSS patterns
    console.log("🔍 [SCANNER] Checking for XSS patterns...")
    const xssPatterns = [
      "<script",
      "javascript:",
      "onload=",
      "onerror=",
      "onclick=",
      "onmouseover=",
      "eval(",
      "alert(",
      "prompt(",
      "confirm("
    ]
    results.script_tags_found = xssPatterns.some((pattern) => 
      html.toLowerCase().includes(pattern.toLowerCase())
    )
    console.log("📝 [SCANNER] XSS patterns found:", results.script_tags_found)

    // Naive SQLi check - look for common SQL injection patterns in URL
    console.log("🔍 [SCANNER] Checking for SQL injection patterns...")
    const sqlPatterns = ["'", '"', "--", "/*", "*/"]
    results.sqli_risk = sqlPatterns.some((pattern) => url.includes(pattern))
    console.log("💉 [SCANNER] SQL injection risk:", results.sqli_risk)

    // Information disclosure checks
    console.log("🔍 [SCANNER] Checking for information disclosure...")
    
    // Check for server header disclosure
    const serverHeader = headers.get("server")
    results.info_disclosure.server_header = !!serverHeader && serverHeader.length > 0
    
    // Check for X-Powered-By header
    const poweredByHeader = headers.get("x-powered-by")
    results.info_disclosure.powered_by = !!poweredByHeader
    
    // Check for PHP version disclosure in headers
    results.info_disclosure.php_version = !!(serverHeader && serverHeader.toLowerCase().includes("php"))
    
    // Check for ASP.NET version disclosure
    results.info_disclosure.asp_version = !!(serverHeader && serverHeader.toLowerCase().includes("asp"))
    
    console.log("📋 [SCANNER] Information disclosure:", results.info_disclosure)

    console.log("✅ [SCANNER] Scan completed successfully")
    console.log("📊 [SCANNER] Final results:", results)
    
    return results
  } catch (error: unknown) {
    console.error("❌ [SCANNER] Scan failed:", error)
    return {
      missing_headers: [],
      script_tags_found: false,
      sqli_risk: false,
      info_disclosure: {
        server_header: false,
        powered_by: false,
        php_version: false,
        asp_version: false
      },
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
