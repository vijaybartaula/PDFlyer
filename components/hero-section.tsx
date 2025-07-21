import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Ultimate PDF Toolbox
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Effortlessly merge, split, compress, convert, and manipulate your PDFs with the power of PDFlyer.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/tools">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/support">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-2xl transform rotate-2"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-950 rounded-lg shadow-xl transform -rotate-2 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center p-0">
                <img 
                  src="https://images.unsplash.com/photo-1623276527153-fa38c1616b05?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Your Image Description" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
