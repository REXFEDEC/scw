import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ScanResults } from "@/components/scan-results"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch scan details
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (scanError || !scan) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ScanResults scan={scan} />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
