import PdfConverter from "@/components/pdf-converter"
import Link from "next/link"
import { getProductionToolUrl } from "@/lib/constants"

export const metadata = {
  title: "Format Transmuter (Convert) · PDFlyer Atelier",
  description: "Transpose portable documents into editable manuscripts, numerical ledgers, or image plates.",
}

export default function ConvertPage() {
  const productionUrl = getProductionToolUrl("convert")

  return (
    <div className="container max-w-4xl py-10 md:py-16 px-4 md:px-6 mx-auto">
      {/* Breadcrumb & Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
          <Link href="/tools" className="hover:text-foreground">
            The Atelier
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Instrument IV · Format Transmuter</span>
        </div>
        <div className="text-[0.68rem] font-mono text-muted-foreground">
          Endpoint: <span className="text-foreground/80">{productionUrl}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="p-6 md:p-8 bg-card border border-border rounded-sm deckle-border">
        <PdfConverter />
      </div>

      {/* Navigation Return */}
      <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground underline">
          Return to Atelier Index
        </Link>
        <Link href="/tools/watermark" className="hover:text-foreground">
          Proceed to Attribution & Seal
        </Link>
      </div>
    </div>
  )
}
