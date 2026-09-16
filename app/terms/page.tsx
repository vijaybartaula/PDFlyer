import SiteLayout from "@/components/site-layout"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service & Covenant of Use — PDFlyer",
  description: "The covenants, terms of engagement, and mutual responsibilities governing the use of PDFlyer instruments.",
}

export default function TermsPage() {
  return (
    <SiteLayout>
      <article className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Header */}
        <header className="border-b border-border pb-8 mb-10">
          <div className="editorial-tag text-muted-foreground mb-2">Legal Colophon · Terms of Engagement</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            Terms of Service & Covenant of Use
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic max-w-2xl">
            A statement of mutual integrity, intellectual property ownership, and the proper employment of our digital instruments.
          </p>
          <div className="mt-4 text-xs font-mono text-muted-foreground">
            Revision 1.4 · Recorded for Public Record
          </div>
        </header>

        {/* Content */}
        <div className="space-y-10 text-foreground/90 leading-relaxed font-sans text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              I. Acceptance of the Covenant
            </h2>
            <p>
              By accessing the PDFlyer atelier, utilizing any of our six primary instruments, or referencing our digital
              records, you signify your unreserved assent to the conditions set forth herein. If any clause of these
              terms contradicts your standards of practice, you are requested to abstain from engaging with the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              II. Inviolable Ownership of Your Papers
            </h2>
            <p>
              We declare without equivocation: every document, ledger, letter, or graphic composition submitted to PDFlyer
              remains in entirety the exclusive intellectual property of its rightful holder.
            </p>
            <p>
              PDFlyer claims neither title, nor copyright, nor implicit license over your folios. Because our instruments
              operate via client-side execution within your browser, no copy of your work is claimed, retained, or
              reproduced for the benefit of this organization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              III. Honorable Conduct & Permissible Use
            </h2>
            <p>
              The atelier is placed at the disposal of scholars, professionals, publishers, and citizens for lawful and
              constructive pursuits. It is strictly forbidden to deploy our utilities for:
            </p>
            <ul className="space-y-2 pl-5 list-disc text-muted-foreground">
              <li>The forgery, fraudulent alteration, or unlawful manipulation of judicial or state credentials.</li>
              <li>The propagation of harmful or malicious digital payloads disguised within document containers.</li>
              <li>
                Any automated denial-of-service or volumetric bombardment intended to impair access for fellow patrons.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              IV. Provision of Instruments As-Is & Limitation of Liability
            </h2>
            <p>
              While every instrument in our compendium has been calibrated with meticulous care and mathematical rigor,
              PDFlyer provides its facilities on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis.
            </p>
            <p>
              In no circumstance shall the artisans, authors, or custodians of PDFlyer be held liable for any loss of
              business, incidental document corruption, or consequential damages resulting from the handling of files.
              Patrons are always counselled to preserve master archival copies of their vital records prior to any
              editorial transformation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-foreground">
              V. Modifications to These Terms
            </h2>
            <p>
              We reserve the prerogative to revise this covenant as statutory demands or technical enhancements require.
              Significant revisions will be accompanied by an updated colophon notice upon this page.
            </p>
          </section>
        </div>

        {/* Colophon Stamp */}
        <footer className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>The PDFlyer Archive & Atelier · Canonical Terms</div>
          <Link href="/privacy" className="hover:text-foreground underline">
            Consult the Privacy Covenant
          </Link>
        </footer>
      </article>
    </SiteLayout>
  )
}
