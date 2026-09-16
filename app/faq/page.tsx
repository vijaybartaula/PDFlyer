import SiteLayout from "@/components/site-layout"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "Colophon & Queries — PDFlyer Atelier",
  description: "Explanations concerning our client-side mechanics, document security, folio formatting, and atelier practices.",
}

export default function FaqPage() {
  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Masthead */}
        <header className="border-b border-border pb-8 mb-12">
          <div className="editorial-tag text-muted-foreground mb-2">Explanations & Reference</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            Colophon & Queries
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic max-w-2xl leading-relaxed">
            Direct explanations concerning our client-side computational model, document sanctity, and the proper handling of manuscripts.
          </p>
        </header>

        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="border border-border bg-card px-4 rounded-sm">
              <AccordionTrigger className="font-serif text-base md:text-lg font-medium py-4 text-foreground hover:no-underline">
                What is the fundamental nature of PDFlyer?
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed pb-4">
                PDFlyer is a dedicated digital bindery and instrument desk designed for assembling, partitioning, compressing,
                transmuting, sealing, and rectifying portable document folios. Unlike conventional cloud utilities, our instruments
                execute directly within your browser&apos;s volatile memory without transmitting manuscript content to remote servers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border bg-card px-4 rounded-sm">
              <AccordionTrigger className="font-serif text-base md:text-lg font-medium py-4 text-foreground hover:no-underline">
                Are my documents truly insulated from server inspection?
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed pb-4">
                Yes, completely. Operations such as merging, page extraction, watermark stamping, and page rotation occur
                exclusively within your local browser environment through client-side WebAssembly and JavaScript engines.
                No unencrypted data departs your machine, ensuring full compliance with the strictest confidentiality demands.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border bg-card px-4 rounded-sm">
              <AccordionTrigger className="font-serif text-base md:text-lg font-medium py-4 text-foreground hover:no-underline">
                What compensation or payment is expected for employing the atelier?
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed pb-4">
                PDFlyer is offered as an open public utility for personal, civic, and scholarly use without fee, subscription
                mandate, or credit card requirement. Because computational work is borne by the client device, we avoid the heavy
                server hosting costs that typically motivate paywalls.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border bg-card px-4 rounded-sm">
              <AccordionTrigger className="font-serif text-base md:text-lg font-medium py-4 text-foreground hover:no-underline">
                Does the service function reliably upon portable handheld screens?
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed pb-4">
                Without exception. The interface adapts gracefully across hand-held telephones, portable tablets, and expansive
                desktop desks while maintaining typographic legibility and touch accessibility.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border bg-card px-4 rounded-sm">
              <AccordionTrigger className="font-serif text-base md:text-lg font-medium py-4 text-foreground hover:no-underline">
                How is typographical formatting preserved during volume assembly?
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed pb-4">
                Our Document Assembler preserves embedded PostScript and TrueType font metrics, vector art paths, and boundary
                boxes verbatim. It combines distinct page streams without re-rendering or altering the typographic DNA of the
                original leaves.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-14 p-6 border border-border bg-card rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-serif font-medium text-foreground text-sm">Have further questions or observations?</div>
              <div className="text-xs text-muted-foreground font-sans">Our desk welcomes direct correspondence.</div>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 border border-border bg-background hover:bg-muted text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors text-foreground"
            >
              Address the Desk
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
