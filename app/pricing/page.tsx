import SiteLayout from "@/components/site-layout"
import Link from "next/link"

export const metadata = {
  title: "Public Utility & Patronage — PDFlyer Atelier",
  description: "Our honest model of universal access, client-side efficiency, and institutional support.",
}

export default function PricingPage() {
  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Masthead */}
        <header className="text-center max-w-2xl mx-auto mb-14">
          <div className="editorial-tag text-muted-foreground mb-2">Economics of the Atelier</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            An Open Public Utility
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
            We reject the modern trend of imposing artificial paywalls, confusing credit tiers, or coercive subscriptions upon fundamental tools.
          </p>
        </header>

        {/* The Atelier Ledger Card */}
        <div className="p-8 md:p-12 bg-card border border-border rounded-sm deckle-border space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border pb-6 gap-2">
            <div>
              <span className="editorial-tag text-muted-foreground">Universal Access</span>
              <h2 className="text-2xl font-serif font-medium text-foreground mt-1">
                The Sovereign Standard
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl md:text-4xl font-serif font-bold text-foreground">Gratis</span>
              <span className="text-xs text-muted-foreground block font-sans">Zero subscription fee · Open access</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-foreground/90 font-sans leading-relaxed">
            <p>
              Because PDFlyer is architected to perform its calculations directly within the browser on your own device,
              we incur virtually none of the astronomical cloud processing overhead that corporate conglomerates cite
              when charging recurring subscription fees.
            </p>
            <p>
              Consequently, all six primary instruments—the Document Assembler, Folio Partition, Volume Compressor, Format
              Transmuter, Attribution Seal, and Orientation Corrector—are freely at your disposal without artificial daily
              quotas or forced account creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/70 text-xs font-sans">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
              <span>Full access to all six client-side folio instruments</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
              <span>Zero server storage or external document inspection</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
              <span>Complete desktop and mobile browser compatibility</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
              <span>No email subscription or credit card requirement</span>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/tools"
              className="w-full sm:w-auto px-6 py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 text-center transition-opacity"
            >
              Begin Working in the Atelier
            </Link>
            <span className="text-xs text-muted-foreground italic font-serif">
              Immediately operational · No registration required
            </span>
          </div>
        </div>

        {/* Institutional Inquiries */}
        <div className="mt-14 p-6 border border-border bg-muted/40 rounded-sm text-xs font-sans text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <strong className="text-foreground block font-serif text-sm mb-1">
              Institutional Deployments & Archival Integration
            </strong>
            For research libraries, universities, or legal chambers seeking air-gapped private instances, please address inquiries to our desk.
          </div>
          <Link
            href="/contact"
            className="whitespace-nowrap px-4 py-2 border border-border bg-background hover:bg-muted text-foreground text-xs uppercase tracking-wider font-medium rounded-sm transition-colors text-center"
          >
            Direct Inquiry
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}
