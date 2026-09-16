"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export default function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Close panel on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const navItems = [
    { href: "/", label: "Frontispiece" },
    { href: "/tools", label: "The Atelier" },
    { href: "/about", label: "Our Ethos" },
    { href: "/faq", label: "Colophon & Queries" },
    { href: "/contact", label: "Correspondence" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 border-b border-border transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Masthead Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-foreground flex items-center justify-center text-background font-serif font-bold text-base shadow-sm">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif tracking-tight font-semibold text-foreground group-hover:opacity-80 transition-opacity">
                PDFlyer
              </span>
              <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-sans -mt-1">
                Atelier & Bindery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-wider font-sans font-medium transition-colors ${
                    isActive
                      ? "text-foreground border-b border-foreground pb-0.5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Controls & Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme appearance"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm border border-transparent hover:border-border"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <Link
              href="/tools"
              className="text-xs uppercase tracking-wider font-sans font-medium py-1.5 px-3 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity"
            >
              Enter Atelier
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 border border-border rounded-sm text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Panel Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-border flex-shrink-0">
            <span className="text-xs uppercase tracking-widest font-sans text-muted-foreground">Navigation</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm border border-transparent hover:border-border"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col flex-1 px-5 py-6 gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-sans py-3 px-3 rounded-sm transition-colors ${
                    isActive
                      ? "font-semibold text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Panel Footer CTA */}
          <div className="px-5 py-5 border-t border-border flex-shrink-0">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-xs uppercase tracking-wider font-sans font-medium py-2.5 px-4 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity"
            >
              Enter Atelier
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
