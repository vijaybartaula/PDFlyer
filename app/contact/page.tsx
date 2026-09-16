"use client"

import type React from "react"
import { useState } from "react"
import SiteLayout from "@/components/site-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate epistolary dispatch
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast({
      title: "Dispatch Transmitted",
      description: "Your correspondence has been safely received by the atelier desk.",
    })

    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setIsSubmitting(false)
  }

  return (
    <SiteLayout>
      <div className="container max-w-4xl py-12 md:py-20 px-4 md:px-6 mx-auto">
        {/* Header */}
        <header className="border-b border-border pb-8 mb-12">
          <div className="editorial-tag text-muted-foreground mb-2">Direct Exchange · Inquiries</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-foreground mb-4">
            The Correspondence Desk
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-serif italic max-w-2xl leading-relaxed">
            Address technical inquiries, institutional queries, or commentary directly to the artisans and stewards of PDFlyer.
          </p>
        </header>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Post Address & Registry */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <div className="editorial-tag text-muted-foreground mb-2">Registry & Depository</div>
              <h2 className="text-xl font-serif font-medium text-foreground mb-3">
                Direct Channels
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed mb-6">
                All communications are reviewed by our primary technical team without automated call triage.
              </p>
            </div>

            <div className="space-y-6 text-xs md:text-sm font-sans">
              <div className="p-4 border border-border bg-card rounded-sm space-y-1">
                <div className="editorial-tag text-muted-foreground text-[0.65rem]">Electronic Mail</div>
                <div className="font-mono text-foreground font-medium">contact@pdflyer.com</div>
                <div className="text-[0.7rem] text-muted-foreground">General consultations & architectural feedback</div>
              </div>

              <div className="p-4 border border-border bg-card rounded-sm space-y-1">
                <div className="editorial-tag text-muted-foreground text-[0.65rem]">Postal Residence</div>
                <div className="font-serif text-foreground font-medium">PDFlyer Atelier</div>
                <div className="text-muted-foreground text-xs leading-relaxed">
                  Namobuddha, Kavre 45200<br />
                  Nepal
                </div>
              </div>

              <div className="p-4 border border-border bg-card rounded-sm space-y-1">
                <div className="editorial-tag text-muted-foreground text-[0.65rem]">Turnaround Cadence</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Dispatches are typically acknowledged within one working day.
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <div className="p-6 md:p-8 border border-border bg-card rounded-sm deckle-border">
              <h2 className="text-xl font-serif font-medium text-foreground mb-6">
                Compose Dispatch
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider font-sans text-muted-foreground">
                    Your Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arthur Quiller-Couch"
                    className="rounded-sm border-border bg-background text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider font-sans text-muted-foreground">
                    Electronic Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@oxford.edu"
                    className="rounded-sm border-border bg-background text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs uppercase tracking-wider font-sans text-muted-foreground">
                    Subject of Inquiry
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Regarding Folio Assembly in Bulk"
                    className="rounded-sm border-border bg-background text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs uppercase tracking-wider font-sans text-muted-foreground">
                    Message Matter
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your dispatch here..."
                    rows={5}
                    className="rounded-sm border-border bg-background text-sm font-sans leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-foreground text-background text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Transmitting Dispatch..." : "Transmit Dispatch"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
