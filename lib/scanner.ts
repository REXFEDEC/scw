interface ScanResults {
  missing_headers: string[]
  script_tags_found: boolean
  sqli_risk: boolean
  error?: string
}

export async function scanWebsite(url: string): Promise<ScanResults> {
  const results: ScanResults = {
    missing_headers: [],
    script_tags_found: false,
    sqli_risk: false,
  }

  try {
    // Perform GET request to the target URL
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "ScanWeb Security Scanner/1.0",
      },
      // Set timeout
      signal: AbortSignal.timeout(10000),
    })

    const headers = response.headers
    const html = await response.text()

    // Check for missing security headers
    const headersToCheck = ["x-frame-options", "content-security-policy", "strict-transport-security"]

    results.missing_headers = headersToCheck.filter((header) => !headers.has(header))

    // Naive XSS check - look for script tags
    results.script_tags_found = html.toLowerCase().includes("<script>")

    // Naive SQLi check - look for common SQL injection patterns in URL
    const sqlPatterns = ["'", '"', "--", "/*", "*/"]
    results.sqli_risk = sqlPatterns.some((pattern) => url.includes(pattern))

    return results
  } catch (error: unknown) {
    return {
      missing_headers: [],
      script_tags_found: false,
      sqli_risk: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getAISummary(results: ScanResults): Promise<string> {
  try {
    const response = await fetch("https://vulscan.sameermann5335.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ results }),
    })

    if (!response.ok) {
      throw new Error(`Worker responded with status ${response.status}`)
    }

    const data = await response.json()

    // The worker returns { summary, recommendations }
    // We'll format it as markdown
    let markdown = ""

    if (data.summary) {
      markdown = data.summary
    }

    if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
      markdown += "\n\n## Recommendations\n\n"
      data.recommendations.forEach((rec: string) => {
        markdown += `- ${rec}\n`
      })
    }

    return markdown || "AI summary generated successfully."
  } catch (error: unknown) {
    console.error("[v0] Error getting AI summary:", error)
    return "Unable to generate AI summary at this time. Please try again later."
  }
}
