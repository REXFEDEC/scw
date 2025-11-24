import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's scans
  const { data: scans } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalScans = scans?.length || 0
  const completedScans = scans?.filter((s) => s.status === "completed").length || 0
  const pendingScans = scans?.filter((s) => s.status === "pending" || s.status === "scanning").length || 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage and review your vulnerability scans</p>
          </div>
          <Link href="/scan">
            <Button size="lg">
              <Shield className="w-5 h-5 mr-2" />
              New Scan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              <Shield className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalScans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{completedScans}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingScans}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest vulnerability scan results</CardDescription>
          </CardHeader>
          <CardContent>
            {!scans || scans.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No scans yet</h3>
                <p className="text-muted-foreground mb-6">Start your first vulnerability scan to see results here</p>
                <Link href="/scan">
                  <Button>Start Your First Scan</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{scan.url}</h4>
                        {scan.status === "completed" && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Completed
                          </Badge>
                        )}
                        {scan.status === "scanning" && (
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                            Scanning
                          </Badge>
                        )}
                        {scan.status === "pending" && (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            Pending
                          </Badge>
                        )}
                        {scan.status === "failed" && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            Failed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                        {scan.scan_duration && <span>{scan.scan_duration}s duration</span>}
                        {scan.vulnerabilities && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {Object.keys(scan.vulnerabilities).length} vulnerabilities
                          </span>
                        )}
                      </div>
                    </div>
                    {scan.status === "completed" && (
                      <Link href={`/scan/${scan.id}`}>
                        <Button variant="outline" size="sm">
                          View Report
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
