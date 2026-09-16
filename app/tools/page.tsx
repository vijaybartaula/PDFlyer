"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import PdfMerger from "@/components/pdf-merger"
import PdfSplitter from "@/components/pdf-splitter"
import PdfCompressor from "@/components/pdf-compressor"
import PdfConverter from "@/components/pdf-converter"
import PdfWatermark from "@/components/pdf-watermark"
import PdfRotate from "@/components/pdf-rotate"
import ToolsDirectory from "@/components/tools-directory"

export default function ToolsPage() {
  return (
    <div className="container max-w-6xl py-12 md:py-16 px-4 md:px-6 mx-auto">
      {/* Workbench Header */}
      <header className="text-center max-w-3xl mx-auto mb-12">
        <div className="editorial-tag text-muted-foreground mb-2">Workbench & Instruments</div>
        <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
          The Master Atelier
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Select an instrument from the ledger below. Processing commences immediately within your browser session; no folios ever depart your device.
        </p>
      </header>

      {/* Primary Tabbed Workbench */}
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-muted/60 border border-border rounded-sm mb-8">
            <TabsTrigger
              value="merge"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Assembler
            </TabsTrigger>
            <TabsTrigger
              value="split"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Partition
            </TabsTrigger>
            <TabsTrigger
              value="compress"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Compress
            </TabsTrigger>
            <TabsTrigger
              value="convert"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Transmute
            </TabsTrigger>
            <TabsTrigger
              value="watermark"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Seal
            </TabsTrigger>
            <TabsTrigger
              value="rotate"
              className="py-2 text-xs uppercase tracking-wider font-sans font-medium rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Rectify
            </TabsTrigger>
          </TabsList>

          <Card className="border border-border bg-card shadow-sm rounded-sm">
            <CardContent className="p-6 md:p-8">
              <TabsContent value="merge" className="mt-0 focus-visible:outline-none">
                <PdfMerger />
              </TabsContent>
              <TabsContent value="split" className="mt-0 focus-visible:outline-none">
                <PdfSplitter />
              </TabsContent>
              <TabsContent value="compress" className="mt-0 focus-visible:outline-none">
                <PdfCompressor />
              </TabsContent>
              <TabsContent value="convert" className="mt-0 focus-visible:outline-none">
                <PdfConverter />
              </TabsContent>
              <TabsContent value="watermark" className="mt-0 focus-visible:outline-none">
                <PdfWatermark />
              </TabsContent>
              <TabsContent value="rotate" className="mt-0 focus-visible:outline-none">
                <PdfRotate />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Dedicated Clickable Tools Directory with Canonical URLs */}
      <div className="mt-20 pt-12 border-t border-border">
        <ToolsDirectory
          headline="Canonical Index of Instruments"
          subhead="Each instrument is accessible directly via its individual canonical production endpoint or relative path."
        />
      </div>
    </div>
  )
}
