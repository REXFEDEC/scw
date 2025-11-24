import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Brain, Lock, Search, FileText } from "lucide-react"
import { PublicNavigation } from "@/components/public-navigation"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Professional Vulnerability Scanning Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover security vulnerabilities in your websites with AI-powered analysis. Get comprehensive reports and
              actionable insights in minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Start Scanning Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 rounded-lg overflow-hidden border border-border shadow-2xl">
            <img src="/security-dashboard-with-vulnerability-scan-results.jpg" alt="ScanWeb Dashboard Preview" className="w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Security Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to identify and fix security vulnerabilities in your web applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Comprehensive Scanning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Detects XSS, SQL injection, CSRF, security misconfigurations, and more across your entire site.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get intelligent summaries and prioritized recommendations powered by advanced AI models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete vulnerability scans in minutes with our optimized scanning engine.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Detailed Reports</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Export comprehensive reports with vulnerability details, severity ratings, and fix recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Secure & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your scan data is encrypted and stored securely. We never share your information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Industry Standards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Follows OWASP Top 10 and industry best practices for vulnerability detection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">Ready to Secure Your Website?</h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of developers and security professionals using ScanWeb to protect their applications.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg px-12">
              Start Free Scan Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">ScanWeb</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ScanWeb. Professional vulnerability scanning platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
