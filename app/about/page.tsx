import SiteLayout from "@/components/site-layout"
import Link from "next/link"

export const metadata = {
  title: "Our Ethos & Foundation — PDFlyer Atelier",
  description: "The historical conviction and architectural principles guiding the PDFlyer digital bindery.",
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <article className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Masthead */}
        <header className="border-b border-border pb-8 mb-12">
          <div className="editorial-tag text-muted-foreground mb-2">The Atelier Chronicle · Foundation</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            Our Ethos & Foundation
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic max-w-2xl leading-relaxed">
            On the necessity of quiet craftsmanship, personal sovereignty over the printed word, and the restoration of dignity to everyday digital instruments.
          </p>
        </header>

        {/* Narrative */}
        <div className="space-y-12 text-foreground/90 font-sans text-sm md:text-base leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-medium text-foreground">
              I. The Origin of the Atelier
            </h2>
            <p>
              In an era dominated by sprawling cloud conglomerates, the simple handling of written folios has become
              unnecessarily encumbered. A task as fundamental as binding two records together or extracting a page
              gradually became an ordeal of mandatory registrations, recurring subscriptions, and the surrender of
              private papers to distant remote servers.
            </p>
            <p>
              PDFlyer was conceived in 2024 as a quiet counter-movement. Inspired by the meticulous discipline of early
              twentieth-century bookbinders and letterpress artisans, we set out to build an atelier where the computer
              serves solely as a refined craftsman&apos;s desk. Here, every operation runs locally, unobserved and unencumbered.
            </p>
          </section>

          {/* Three Core Disciplines */}
          <section className="space-y-6 pt-4">
            <h2 className="text-2xl font-serif font-medium text-foreground">
              II. Three Cardinal Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 border border-border bg-card rounded-sm">
                <div className="editorial-tag text-muted-foreground mb-2">Principle I</div>
                <h3 className="text-lg font-serif font-medium text-foreground mb-2">Absolute Sanctity</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your folios never depart the boundary of your browser. Computation occurs in local memory, leaving zero
                  residue upon external servers.
                </p>
              </div>

              <div className="p-5 border border-border bg-card rounded-sm">
                <div className="editorial-tag text-muted-foreground mb-2">Principle II</div>
                <h3 className="text-lg font-serif font-medium text-foreground mb-2">Typographic Fidelity</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We treat margins, font encodings, and layout geometries with binder precision, avoiding the arbitrary
                  reflow that damages delicate manuscripts.
                </p>
              </div>

              <div className="p-5 border border-border bg-card rounded-sm">
                <div className="editorial-tag text-muted-foreground mb-2">Principle III</div>
                <h3 className="text-lg font-serif font-medium text-foreground mb-2">Unadorned Utility</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No artificial tiers, subscription walls, or coercive user profiling. The instruments exist to perform
                  their duty faithfully without delay.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-serif font-medium text-foreground">
              III. The Promise to Our Patrons
            </h2>
            <p>
              Whether you are an archivist preparing historical monographs, an advocate organizing legal pleadings, or a
              student arranging research leaves, PDFlyer remains your discreet, faithful workbench.
            </p>
            <p>
              We neither monetize your attention nor catalog your records. Our satisfaction lies in the quiet elegance
              of an orderly document well composed.
            </p>
          </section>
        </div>

        {/* Colophon Sign-off */}
        <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>PDFlyer Digital Bindery · Published for Public Consultation</div>
          <div className="flex gap-4">
            <Link href="/tools" className="text-foreground hover:underline font-medium">
              Enter the Atelier
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-foreground">
              Direct Correspondence
            </Link>
          </div>
        </footer>
      </article>
    </SiteLayout>
  )
}
