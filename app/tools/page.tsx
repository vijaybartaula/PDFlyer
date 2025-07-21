import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import PdfMerger from "@/components/pdf-merger"
import PdfSplitter from "@/components/pdf-splitter"
import PdfCompressor from "@/components/pdf-compressor"
import PdfConverter from "@/components/pdf-converter"
import PdfWatermark from "@/components/pdf-watermark"
import PdfRotate from "@/components/pdf-rotate"

export default function ToolsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">PDF Tools</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">Select a tool to get started with your PDF tasks</p>
      </div>

      <Tabs defaultValue="merge" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="merge">Merge</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
          <TabsTrigger value="compress">Compress</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="watermark">Watermark</TabsTrigger>
          <TabsTrigger value="rotate">Rotate</TabsTrigger>
        </TabsList>
        <Card>
          <CardContent className="p-6">
            <TabsContent value="merge" className="mt-0">
              <PdfMerger />
            </TabsContent>
            <TabsContent value="split" className="mt-0">
              <PdfSplitter />
            </TabsContent>
            <TabsContent value="compress" className="mt-0">
              <PdfCompressor />
            </TabsContent>
            <TabsContent value="convert" className="mt-0">
              <PdfConverter />
            </TabsContent>
            <TabsContent value="watermark" className="mt-0">
              <PdfWatermark />
            </TabsContent>
            <TabsContent value="rotate" className="mt-0">
              <PdfRotate />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
