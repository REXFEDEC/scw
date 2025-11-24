import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Users, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            By using ScanWeb, you agree to these terms and conditions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: November 2025</p>
        </div>

        {/* Agreement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-6 h-6 text-primary" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing and using ScanWeb, you accept and agree to be bound by the terms and 
              provision of this agreement. These Terms of Service apply to all users of the service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ScanWeb is a professional vulnerability scanning service that helps identify security 
              issues in web applications. Our service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Automated vulnerability scanning</li>
              <li>AI-powered security analysis</li>
              <li>Detailed security reports</li>
              <li>Scan history and tracking</li>
              <li>Export functionality for reports</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Acceptable Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Permitted Use</h3>
                <p className="text-muted-foreground mb-4">
                  You may use ScanWeb to scan websites and web applications that you own or have 
                  explicit permission to test. Our service is intended for legitimate security testing purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Prohibited Use</h3>
                <p className="text-muted-foreground mb-4">
                  You may not use ScanWeb to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Scan websites you don't own or have permission to test</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to disrupt our service or other users</li>
                  <li>Use the service for malicious purposes</li>
                  <li>Reverse engineer or attempt to exploit our scanning technology</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-primary" />
              Service Limitations & Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">No Guarantee of Complete Security</h3>
                <p className="text-muted-foreground">
                  While we strive to provide comprehensive vulnerability scanning, no security tool can 
                  guarantee 100% detection of all vulnerabilities. Our service should be used as part of 
                  a comprehensive security strategy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Accuracy Limitations</h3>
                <p className="text-muted-foreground">
                  False positives and false negatives may occur. Users should manually verify and validate 
                  scan results before taking action based on our reports.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Service Availability</h3>
                <p className="text-muted-foreground">
                  We strive to maintain high availability but cannot guarantee uninterrupted service. 
                  We may experience downtime for maintenance or technical issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Security</h3>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the security of your account credentials and for 
                  all activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Compliance</h3>
                <p className="text-muted-foreground">
                  You must comply with all applicable laws and regulations when using our service, 
                  including data protection and privacy laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Reporting Issues</h3>
                <p className="text-muted-foreground">
                  If you discover any security vulnerabilities or issues with our service, please 
                  report them responsibly rather than exploiting them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To the maximum extent permitted by law, ScanWeb shall not be liable for any indirect, 
              incidental, special, or consequential damages resulting from your use of our service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our total liability for any claims related to the service shall not exceed the amount 
              you paid for the service in the preceding 12 months.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the service constitutes acceptance 
              of any modified terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: legal@scanweb.dev</p>
              <p>We respond to legal inquiries within 48 hours.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
