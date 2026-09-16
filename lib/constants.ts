export const PRODUCTION_APP_URL: string =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : "") || "https://pdflyer.vercel.app"

export interface ToolDefinition {
  id: string
  slug: string
  title: string
  actionLabel: string
  category: string
  editionNumber: string
  description: string
}

export const TOOLS_CONFIG: ToolDefinition[] = [
  {
    id: "merge",
    slug: "merge",
    title: "Document Assembler",
    actionLabel: "Merge Folios",
    category: "Assembly",
    editionNumber: "Instrument I",
    description:
      "Unite separate manuscripts, signatures, and loose folios into a singular, cohesive volume with preserved typographic hierarchy.",
  },
  {
    id: "split",
    slug: "split",
    title: "Folio Partition",
    actionLabel: "Split Pages",
    category: "Extraction",
    editionNumber: "Instrument II",
    description:
      "Sever designated gatherings, extract specific leaf ranges, or divide extensive records into discrete, self-contained sections.",
  },
  {
    id: "compress",
    slug: "compress",
    title: "Volume Compressor",
    actionLabel: "Compress Weight",
    category: "Refinement",
    editionNumber: "Instrument III",
    description:
      "Condense physical document weight and strip redundant metadata without diluting typographical clarity or graphic fidelity.",
  },
  {
    id: "convert",
    slug: "convert",
    title: "Format Transmuter",
    actionLabel: "Convert Medium",
    category: "Transmutation",
    editionNumber: "Instrument IV",
    description:
      "Transpose portable documents into editable manuscripts, numerical ledgers, or image plates suited for broader distribution.",
  },
  {
    id: "watermark",
    slug: "watermark",
    title: "Attribution & Seal",
    actionLabel: "Affix Watermark",
    category: "Provenance",
    editionNumber: "Instrument V",
    description:
      "Inscribe an indelible publisher mark, ownership monogram, or confidentiality seal across every leaf to preserve provenance.",
  },
  {
    id: "rotate",
    slug: "rotate",
    title: "Orientation Corrector",
    actionLabel: "Rotate Folios",
    category: "Rectification",
    editionNumber: "Instrument VI",
    description:
      "Rectify inverted leaves and misaligned broadsheets to establish upright alignment throughout the entire manuscript.",
  },
]

export function getProductionToolUrl(slug: string): string {
  return `${PRODUCTION_APP_URL}/tools/${slug}`
}
