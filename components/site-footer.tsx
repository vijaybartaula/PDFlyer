import Link from "next/link"
import { PRODUCTION_APP_URL } from "@/lib/constants"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background pt-16 pb-12 mt-16 text-foreground/80">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Printer's Mark / Colophon */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-foreground text-background font-serif font-bold text-sm flex items-center justify-center">
                P
              </div>
              <span className="text-lg font-serif font-semibold tracking-tight text-foreground">
                PDFlyer
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              A private digital atelier established for the careful assembly, partitioning, and refinement of portable folios.
              Engineered with unyielding respect for personal privacy and computational sovereignty.
            </p>
            <div className="pt-1 text-[0.7rem] font-mono text-muted-foreground">
              Canonical: <span className="text-foreground/80">{PRODUCTION_APP_URL}</span>
            </div>
          </div>

          {/* Instruments */}
          <div className="space-y-3">
            <h3 className="editorial-tag text-foreground tracking-wider">Compendium</h3>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/tools/merge" className="text-muted-foreground hover:text-foreground transition-colors">
                  Document Assembler (Merge)
                </Link>
              </li>
              <li>
                <Link href="/tools/split" className="text-muted-foreground hover:text-foreground transition-colors">
                  Folio Partition (Split)
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="text-muted-foreground hover:text-foreground transition-colors">
                  Volume Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="text-muted-foreground hover:text-foreground transition-colors">
                  Format Transmuter (Convert)
                </Link>
              </li>
              <li>
                <Link href="/tools/watermark" className="text-muted-foreground hover:text-foreground transition-colors">
                  Attribution & Seal (Watermark)
                </Link>
              </li>
              <li>
                <Link href="/tools/rotate" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orientation Corrector (Rotate)
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Correspondence */}
          <div className="space-y-3">
            <h3 className="editorial-tag text-foreground tracking-wider">The Atelier</h3>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Ethos & Principles
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Colophon & Common Queries
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Direct Correspondence Desk
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  Full Instrument Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* The Legal Covenant */}
          <div className="space-y-3">
            <h3 className="editorial-tag text-foreground tracking-wider">Covenants</h3>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Covenant & Data Sanctity
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service & Engagement
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/60 italic font-serif">
                  Client-side execution guaranteed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-sans">
          <div>
            &copy; {currentYear} PDFlyer Atelier. Set in classical typographic proportion. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Covenant
            </Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Engagement
            </Link>
            <span className="text-border">·</span>
            <Link href="https://github.com/bijaybartaula/PDFlyer" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Source Repository
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
