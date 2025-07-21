import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About PDFlyer</h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Our mission is to make PDF manipulation accessible, efficient, and secure for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            In the year of grace, amidst the growing shadows of complexity and cost, PDFlyer emerged—a solution born from necessity. The tools of the past, burdened with intricate demands, asked for gold and ignored the sacred trust of privacy. In this moment, we, the creators, sought to craft a solution simple in form, noble in intent—one that would neither strain the purse nor betray the trust of its users.
          </p>
          <p className="text-muted-foreground mb-4">
            Founded by leap year in 2024, a fellowship of developers and designers labored with unwavering hearts. We sought not just to create a tool, but to build a haven where managing PDFs would be effortless. We believe that all, from noble merchant to humble scribe, should control their documents without fear for their privacy or resources.
          </p>
          <p className="text-muted-foreground">
            Today, PDFlyer stands as a beacon, guiding individuals and businesses across the globe. Workflows, once burdensome, are now swift, and the worries of users have been lifted, allowing their spirits to soar.
          </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1496867506859-2421b3d9a226?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="PDFlyer team" className="w-full h-auto" />
          </div>
        </div>

        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                We believe your documents are your business. We process files locally when possible and never store your
                content.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Simplicity</h3>
              <p className="text-muted-foreground">
                We strive to make our tools intuitive and easy to use, eliminating complexity without sacrificing
                functionality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Reliability</h3>
              <p className="text-muted-foreground">
                We build our tools to be dependable and consistent, ensuring your documents are processed correctly
                every time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Us on Our Journey</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            We're just getting started, and we're excited to continue improving PDFlyer with new features and
            capabilities. We'd love to have you along for the ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
