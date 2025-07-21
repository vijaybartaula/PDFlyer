import SiteLayout from "@/components/site-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Merge, Scissors, FileArchiveIcon as Compress, FileOutput, Stamp, RotateCw } from "lucide-react"

export default function Home() {
  return (
    <SiteLayout>
      {/* Hero Section with improved visuals */}
      <section className="relative w-full min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>

        {/* Content */}
        <div className="container relative z-10 px-4 md:px-6 py-12 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                  Your Ultimate PDF Toolbox
                </h1>
                <p className="max-w-[600px] text-xl text-muted-foreground">
                  Effortlessly merge, split, compress, convert, and manipulate your PDFs with the power of PDFlyer.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/tools">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[500px]">
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full filter blur-3xl"></div>

              {/* Main image with floating effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md animate-float">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-2xl transform rotate-2"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-950 rounded-lg shadow-xl transform -rotate-2 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1623276527153-fa38c1616b05?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="PDF document with annotations"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Powerful PDF Tools</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to work with PDFs in one place. Fast, easy, and powerful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: <Merge className="h-10 w-10" />,
                title: "Merge PDFs",
                description: "Combine multiple PDF documents into a single file with ease.",
                href: "/tools/merge",
              },
              {
                icon: <Scissors className="h-10 w-10" />,
                title: "Split PDFs",
                description: "Extract specific pages or split large documents into smaller files.",
                href: "/tools/split",
              },
              {
                icon: <Compress className="h-10 w-10" />,
                title: "Compress PDFs",
                description: "Reduce file size while maintaining quality for easier sharing.",
                href: "/tools/compress",
              },
              {
                icon: <FileOutput className="h-10 w-10" />,
                title: "Convert PDFs",
                description: "Transform PDFs to Word, Excel, images, or other formats.",
                href: "/tools/convert",
              },
              {
                icon: <Stamp className="h-10 w-10" />,
                title: "Add Watermarks",
                description: "Protect your documents with custom text or image watermarks.",
                href: "/tools/watermark",
              },
              {
                icon: <RotateCw className="h-10 w-10" />,
                title: "Rotate Pages",
                description: "Adjust page orientation to correct sideways or upside-down content.",
                href: "/tools/rotate",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full"
              >
                <div className="p-3 w-fit rounded-lg bg-primary/10 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                <Button variant="ghost" size="sm" className="gap-1 mt-auto self-start" asChild>
                  <Link href={feature.href}>
                    Try Now <span className="ml-1">→</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Why Choose PDFlyer?</h2>
              <ul className="space-y-6">
                {[
                  {
                    title: "Privacy First",
                    description: "Your files are processed locally and never stored on our servers.",
                  },
                  {
                    title: "Lightning Fast",
                    description: "Process your PDFs in seconds with our optimized algorithms.",
                  },
                  {
                    title: "No Installation",
                    description: "Works directly in your browser - no downloads or installations required.",
                  },
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" size="lg" asChild>
                <Link href="/tools">Try It Now</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-background rounded-2xl shadow-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1623276527153-fa38c1616b05?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="PDFlyer in action" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
            Ready to Transform Your PDF Experience?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of users who have simplified their document workflows with PDFlyer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/tools">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
