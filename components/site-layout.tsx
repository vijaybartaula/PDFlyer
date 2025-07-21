import type React from "react"
import MainNav from "@/components/main-nav"
import SiteFooter from "@/components/site-footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      {/* Add padding-top to account for fixed navbar */}
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  )
}
