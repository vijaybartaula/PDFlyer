import SiteLayout from "@/components/site-layout"
import Link from "next/link"

export const metadata = {
  title: "Privacy Covenant & Document Sanctity — PDFlyer",
  description: "Our inviolable covenant regarding document confidentiality, client-side processing, and the complete absence of surveillance.",
}

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <article className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Header */}
        <header className="border-b border-border pb-8 mb-10">
          <div className="editorial-tag text-muted-foreground mb-2">Legal Colophon · Document Sanctity</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            Privacy Covenant & Data Sanctity
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic max-w-2xl">
            Promulgated for the protection of all manuscripts, records, and correspondence submitted to our instruments.
          </p>
          <div className="mt-4 text-xs font-mono text-muted-foreground">
            Effective Date: January 1, 2024 · Current Canonical Record
          </div>
        </header>

        {/* Content */}
        <div className="space-y-10 text-foreground/90 leading-relaxed font-sans text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              I. The Principle of Local Sovereignty
            </h2>
            <p>
              It is the founding conviction of PDFlyer that a document entrusted to a bindery or reading desk remains
              the sole property of its author. Unlike modern digital repositories that aggregate, inspect, and monetize
              the papers of their patrons, PDFlyer operates upon a strict architectural model of client-side execution.
            </p>
            <p>
              When you employ our instruments—whether to assemble disparate folios, excise pages, compress volume, or
              affix an attribution watermark—the computational operations take place directly within the memory of your
              own computing apparatus. Your files are neither transmitted to remote vaults nor retained upon any external
              server.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              II. Information We Do Not Solicit or Retain
            </h2>
            <p>
              To maintain the unassailable integrity of our atelier, we adhere to the following negative covenants:
            </p>
            <ul className="space-y-2 pl-5 list-disc text-muted-foreground">
              <li>
                <strong className="text-foreground">Zero Manuscript Logging:</strong> We possess no mechanism to read,
                index, transcribe, or store the contents, titles, or textual matter of your uploaded documents.
              </li>
              <li>
                <strong className="text-foreground">No Surveillance Trackers:</strong> We deploy no invasive third-party
                behavioral beacons, profiling scripts, or advertising trackers across our interface.
              </li>
              <li>
                <strong className="text-foreground">No Document Monetization:</strong> We do not sell, rent, license, or
                disclose any operational record or metadata to commercial brokers or artificial intelligence scrapers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              III. Temporary Ephemeral Operations
            </h2>
            <p>
              In rare operations where in-browser compilation demands ephemeral memory allocation (such as complex vector
              transmutation), all temporary data representations reside solely in volatile working memory (RAM) and are
              purged immediately upon termination of the browser session or manual dismissal of the workspace.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              IV. Cryptographic Transport & Local Storage
            </h2>
            <p>
              All interactions across the web are enclosed within Transport Layer Security (TLS 1.3 encryption). Any local
              preferences—such as your chosen visual tone (dark or parchment mode)—are preserved strictly within your own
              browser’s local storage and remain invisible to external scrutiny.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              V. Inquiries & Official Registry
            </h2>
            <p>
              Should you require written clarification regarding our architectural safeguards or have queries concerning
              document sanctity, please direct your formal correspondence via our{" "}
              <Link href="/contact" className="underline underline-offset-4 text-foreground font-medium">
                Correspondence Desk
              </Link>
              .
            </p>
          </section>
        </div>

        {/* Colophon Stamp */}
        <footer className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>The PDFlyer Archive & Atelier · Canonical Record</div>
          <Link href="/terms" className="hover:text-foreground underline">
            Proceed to Terms of Service
          </Link>
        </footer>
      </article>
    </SiteLayout>
  )
}
