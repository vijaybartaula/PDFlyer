import type React from "react"
import SiteLayout from "@/components/site-layout"

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteLayout>{children}</SiteLayout>
}
