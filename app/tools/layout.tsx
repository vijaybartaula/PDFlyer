import type React from "react"
import SiteLayout from "@/components/site-layout"

export const metadata = {
  title: "The Atelier · PDFlyer Instruments",
  description: "Direct workspace for assembling, splitting, compressing, transmuting, watermarking, and rotating portable document folios.",
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteLayout>{children}</SiteLayout>
}
