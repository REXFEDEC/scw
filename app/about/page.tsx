import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Target, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About ScanWeb</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional vulnerability scanning platform dedicated to making web security accessible to everyone.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We believe that web security should be accessible to everyone, not just large enterprises with dedicated security teams. 
              ScanWeb was created to democratize vulnerability scanning by providing professional-grade security analysis 
              that's affordable, easy to use, and comprehensive. Our AI-powered approach helps identify security issues 
              before they can be exploited, protecting businesses and their customers.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Security First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security is at the core of everything we build. We follow industry best practices and 
                continuously update our scanning engine to detect the latest threats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                User Focused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We design our tools with developers and security professionals in mind, creating intuitive 
                interfaces that make security analysis simple and actionable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're committed to providing the most comprehensive and accurate vulnerability scanning 
                available, helping our users achieve the highest security standards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Our advanced AI models analyze scan results to provide intelligent summaries, 
                  prioritize vulnerabilities, and offer actionable remediation recommendations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comprehensive Scanning</h3>
                <p className="text-muted-foreground mb-4">
                  We detect hundreds of vulnerability types including XSS, SQL injection, CSRF, 
                  security misconfigurations, and many more using industry-standard techniques.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Real-time Results</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant feedback with our optimized scanning engine that delivers results 
                  in minutes, not hours, without compromising on thoroughness.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Continuous Updates</h3>
                <p className="text-muted-foreground mb-4">
                  Our vulnerability database is continuously updated with the latest security 
                  threats and CVEs to ensure you're protected against emerging risks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
