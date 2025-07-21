import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react" // Fixed: Changed GitHub to Github (correct casing)

export function SiteFooter() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">PDFlyer</h3>
            <p className="text-sm text-muted-foreground">
              Your all-in-one PDF solution for merging, splitting, compressing, and more.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.co/bijaybartaula" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com/bijaybartaula" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com/in/bijaybartaula" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/merge" className="text-muted-foreground hover:text-foreground">
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link href="/tools/split" className="text-muted-foreground hover:text-foreground">
                  Split PDFs
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="text-muted-foreground hover:text-foreground">
                  Compress PDFs
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="text-muted-foreground hover:text-foreground">
                  Convert PDFs
                </Link>
              </li>
              <li>
                <Link href="/tools/watermark" className="text-muted-foreground hover:text-foreground">
                  Add Watermark
                </Link>
              </li>
              <li>
                <Link href="/tools/rotate" className="text-muted-foreground hover:text-foreground">
                  Rotate PDFs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDFlyer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
