import SiteLayout from "@/components/site-layout"
import Link from "next/link"
import ToolsDirectory from "@/components/tools-directory"
import { PRODUCTION_APP_URL } from "@/lib/constants"

export default function Home() {
  return (
    <SiteLayout>
      {/* Hero Section — Literary Frontispiece */}
      <section className="relative w-full border-b border-border bg-background pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Lead Typography */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1 rounded-sm text-[0.7rem] uppercase tracking-widest text-muted-foreground font-sans font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                The Digital Bindery & Atelier · Established 2024
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-foreground leading-[1.12]">
                Refined instruments for the assembly, division, and preservation of portable documents.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl">
                Crafted for scholars, archivists, and deliberate professionals. Every operation executes strictly within the
                sanctuary of your browser memory, free from remote inspection, tracking, or arbitrary confinement.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/tools"
                  className="px-6 py-2.5 bg-foreground text-background font-sans text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
                >
                  Enter the Atelier
                </Link>
                <a
                  href="#instruments-directory"
                  className="px-6 py-2.5 border border-border bg-card text-foreground font-sans text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-muted/70 transition-colors"
                >
                  Examine Instruments
                </a>
              </div>

              <div className="pt-4 text-xs font-serif italic text-muted-foreground">
                Canonical location:{" "}
                <span className="font-mono not-italic text-foreground/80">{PRODUCTION_APP_URL}</span>
              </div>
            </div>

            {/* Classical Workshop Plate (Pure Vector Architectural Graphic — No Stock Photos or Blurs) */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 bg-card border border-border rounded-sm deckle-border">
                {/* Architectural Margin Details */}
                <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-6">
                  <span className="editorial-tag text-[0.65rem] text-muted-foreground">Plate No. 01 · Workshop Scheme</span>
                  <span className="text-[0.65rem] font-mono text-muted-foreground">FIG. ARCH-24</span>
                </div>

                {/* Vector Diagram of Page Leaf Collation */}
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-center py-6">
                    <svg className="w-full max-w-[260px] h-auto text-foreground/85" viewBox="0 0 200 160" fill="none" stroke="currentColor">
                      {/* Leaf 3 (Background) */}
                      <rect x="50" y="20" width="100" height="120" rx="2" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.4" />
                      {/* Leaf 2 (Middle) */}
                      <rect x="40" y="28" width="100" height="120" rx="2" strokeWidth="1" fill="none" opacity="0.6" />
                      {/* Leaf 1 (Foreground) */}
                      <rect x="30" y="36" width="100" height="120" rx="2" strokeWidth="1.25" fill="currentColor" fillOpacity="0.03" />
                      {/* Typographic ruled lines on page */}
                      <line x1="42" y1="52" x2="118" y2="52" strokeWidth="1" />
                      <line x1="42" y1="62" x2="110" y2="62" strokeWidth="0.75" opacity="0.7" />
                      <line x1="42" y1="72" x2="114" y2="72" strokeWidth="0.75" opacity="0.7" />
                      <line x1="42" y1="82" x2="98" y2="82" strokeWidth="0.75" opacity="0.7" />
                      {/* Measurement caliper marks */}
                      <path d="M22 36v120m-4-120h8m-8 120h8" strokeWidth="1" opacity="0.5" />
                      <path d="M140 148h20m-20-4v8m20-8v8" strokeWidth="1" opacity="0.5" />
                      {/* Classical Press Seal */}
                      <circle cx="106" cy="126" r="14" strokeWidth="1" strokeDasharray="2 1" />
                      <circle cx="106" cy="126" r="10" strokeWidth="0.75" />
                      <text x="106" y="130" fontSize="10" textAnchor="middle" fill="currentColor" fontFamily="serif">P</text>
                    </svg>
                  </div>

                  <div className="border-t border-border/80 pt-4 space-y-1.5 text-xs text-muted-foreground font-sans">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Standard Operation:</span>
                      <span>Client In-Memory Buffer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Network Transmission:</span>
                      <span className="text-foreground font-medium">None (Zero Outbound)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Document Sanctity:</span>
                      <span>100% Inviolable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Reusable Tools Section with Production Endpoints */}
      <ToolsDirectory />

      {/* Three Architectural Tenets (Replacing generic checkmark lists or fake features) */}
      <section className="w-full py-16 md:py-24 border-t border-border bg-card/40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="editorial-tag text-muted-foreground mb-2">Our Foundation</div>
            <h2 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-foreground mb-3">
              Principles of Modern Document Stewardship
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We reject the prevailing assumption that everyday utility demands surveillance, complex accounts, or bloated subscriptions.
            </p>
            <div className="w-16 h-[1px] bg-border mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tenet 1 */}
            <div className="p-6 border border-border bg-card rounded-sm flex flex-col justify-between">
              <div>
                <div className="editorial-tag text-[0.65rem] text-muted-foreground mb-2">Tenet I</div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-3">
                  Computational Sovereignty
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">
                  Your files remain housed exclusively upon your hardware. Merging, excising, and stamping occur via browser assembly pipelines without uploading an unencrypted byte to third-party machines.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground italic font-serif">
                Local memory execution
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="p-6 border border-border bg-card rounded-sm flex flex-col justify-between">
              <div>
                <div className="editorial-tag text-[0.65rem] text-muted-foreground mb-2">Tenet II</div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-3">
                  Typographical Integrity
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">
                  Every page boundary, font definition, and structural vector is treated with binder precision. Leaves undergo manipulation without loss of formatting or degradation of embedded typography.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground italic font-serif">
                Exact geometry preservation
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="p-6 border border-border bg-card rounded-sm flex flex-col justify-between">
              <div>
                <div className="editorial-tag text-[0.65rem] text-muted-foreground mb-2">Tenet III</div>
                <h3 className="text-xl font-serif font-medium text-foreground mb-3">
                  Uncompromised Accessibility
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">
                  No coercive registrations, artificial credit caps, or opaque barriers. Every fundamental instrument is accessible directly upon arrival, functioning reliably across modern portable and desktop screens.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted-foreground italic font-serif">
                Universal public utility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Literary Invitation to the Desk (No fake "10,000+ users" or phony quotes) */}
      <section className="w-full py-16 md:py-20 border-t border-border bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="editorial-tag text-muted-foreground">The Workbench Awaits</div>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-foreground">
              Bring Order to Your Digital Folios
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
              Select an instrument from our catalog to commence your assembly, or review our legal covenants detailing the mathematical guarantees of document privacy.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                className="px-6 py-2.5 bg-foreground text-background font-sans text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity"
              >
                Open the Atelier
              </Link>
              <Link
                href="/privacy"
                className="px-6 py-2.5 border border-border bg-card text-foreground font-sans text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-muted/70 transition-colors"
              >
                Inspect Privacy Covenant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
