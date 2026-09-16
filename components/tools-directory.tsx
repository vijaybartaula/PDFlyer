"use client"

import React from "react"
import Link from "next/link"
import { PRODUCTION_APP_URL, TOOLS_CONFIG, getProductionToolUrl, type ToolDefinition } from "@/lib/constants"

export { PRODUCTION_APP_URL, getProductionToolUrl }

// Tool icons mapped to tool slugs with custom classical SVG line-art
const TOOL_ICONS: Record<string, React.ReactNode> = {
  merge: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4v16a1 1 0 001 1h14" strokeLinecap="round" />
      <rect x="7" y="3" width="13" height="15" rx="1" />
      <path d="M10 8h7M10 12h5" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  split: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.5 15.5M8.5 8.5L20 20" strokeLinecap="round" />
    </svg>
  ),
  compress: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  convert: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 14a7 7 0 0113.3-3.2M20 10a7 7 0 01-13.3 3.2" strokeLinecap="round" />
      <path d="M18 4l2 3-3 1M6 20l-2-3 3-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  watermark: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M7 12h10" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
    </svg>
  ),
  rotate: (
    <svg className="w-6 h-6 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="7" y="7" width="13" height="13" rx="1" />
      <path d="M4 12a8 8 0 0114.5-4.5L20 9M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

interface ToolsDirectoryProps {
  className?: string
  headline?: string
  subhead?: string
  showLeadHeader?: boolean
}

export default function ToolsDirectory({
  className = "",
  headline = "The Compendium of Folio Instruments",
  subhead = "Dedicated utilities for document conservation, assembly, and arrangement. Executed strictly client-side with complete privacy.",
  showLeadHeader = true,
}: ToolsDirectoryProps) {
  return (
    <section className={`w-full py-12 ${className}`} id="instruments-directory">
      <div className="container px-4 md:px-6 mx-auto">
        {showLeadHeader && (
          <div className="max-w-2xl mb-12">
            <div className="editorial-tag text-muted-foreground mb-2">Catalogue of Utilities</div>
            <h2 className="text-2xl md:text-3xl font-serif font-normal tracking-tight text-foreground mb-3">
              {headline}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {subhead}
            </p>
            <div className="w-16 h-[1px] bg-border mt-4" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_CONFIG.map((tool: ToolDefinition) => {
            const productionUrl = getProductionToolUrl(tool.slug)
            const internalHref = `/tools/${tool.slug}`
            const icon = TOOL_ICONS[tool.slug] || TOOL_ICONS.merge

            return (
              <article
                key={tool.id}
                className="group relative flex flex-col justify-between p-6 bg-card border border-border rounded-sm hover:border-foreground/30 transition-colors duration-200"
              >
                <div>
                  {/* Card Masthead */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                    <span className="editorial-tag text-[0.65rem] text-muted-foreground">
                      {tool.editionNumber} · {tool.category}
                    </span>
                    <div className="p-1.5 rounded-sm bg-muted/60 text-foreground/80">
                      {icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg md:text-xl font-serif font-medium text-foreground mb-1">
                    <Link href={internalHref} className="hover:underline focus:outline-none">
                      {tool.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-muted-foreground font-sans mb-3">
                    {tool.actionLabel}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                    {tool.description}
                  </p>
                </div>

                {/* Footer & Production URL Link */}
                <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                  <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold">
                    Production Endpoint
                  </div>
                  <Link
                    href={internalHref}
                    className="text-xs font-mono text-foreground/75 hover:text-foreground underline decoration-border hover:decoration-foreground break-all transition-colors"
                    title={`Access ${tool.title}`}
                  >
                    {productionUrl}
                  </Link>

                  <div className="mt-3 flex items-center justify-between pt-2">
                    <Link
                      href={internalHref}
                      className="text-xs font-medium uppercase tracking-wider text-foreground py-1.5 px-3 border border-border bg-background hover:bg-muted/70 transition-colors rounded-sm"
                    >
                      Open Instrument
                    </Link>
                    <span className="text-[0.7rem] text-muted-foreground italic font-serif">
                      In-browser
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
