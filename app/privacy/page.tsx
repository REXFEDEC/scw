import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Users } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is fundamental to our mission. We're committed to protecting your data.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: November 2025</p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Privacy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At ScanWeb, we take your privacy seriously. This privacy policy explains how we collect, 
              use, and protect your information when you use our vulnerability scanning service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to transparency and giving you control over your data. This policy applies 
              to all users of our service and outlines our practices for data collection, storage, and usage.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                <p className="text-muted-foreground">
                  When you create an account, we collect your email address and basic authentication information 
                  necessary to provide our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Scan Data</h3>
                <p className="text-muted-foreground">
                  We store the URLs you scan, scan results, and vulnerability reports. This data is encrypted 
                  and used solely to provide our scanning services and maintain your scan history.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Analytics</h3>
                <p className="text-muted-foreground">
                  We collect basic usage information to improve our services, including scan frequency and 
                  feature usage patterns. No personal data is shared with third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Service Provision</h3>
                <p className="text-muted-foreground">
                  We use your information to provide vulnerability scanning services, generate reports, 
                  and maintain your account functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Service Improvement</h3>
                <p className="text-muted-foreground">
                  Anonymous usage data helps us improve our scanning algorithms and user experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Security</h3>
                <p className="text-muted-foreground">
                  We use your data to maintain account security and prevent unauthorized access to our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Data Protection & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Encryption</h3>
                <p className="text-muted-foreground">
                  All scan data and user information is encrypted at rest and in transit using industry-standard encryption protocols.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Access Control</h3>
                <p className="text-muted-foreground">
                  Only authorized personnel can access your data, and all access is logged and audited regularly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your data only as long as necessary to provide our services. You can delete your account 
                  and all associated data at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Access & Portability</h3>
                <p className="text-muted-foreground">
                  You can request a copy of all your data at any time through your account settings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Correction & Deletion</h3>
                <p className="text-muted-foreground">
                  You can update or delete your personal information and scan history through your account dashboard.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Opt-out</h3>
                <p className="text-muted-foreground">
                  You can opt out of data collection for analytics purposes in your account preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: privacy@scanweb.dev</p>
              <p>We respond to all privacy inquiries within 48 hours.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
