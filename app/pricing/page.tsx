"use client"

import { useState } from "react"
import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface PricingPlan {
  name: string
  description: string
  price: {
    monthly: number
    annual: number
  }
  features: string[]
  cta: string
  popular?: boolean
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const auth = useAuth()
  const router = useRouter()

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic PDF tools for occasional use",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        "Merge up to 3 PDFs",
        "Split PDFs (up to 10 pages)",
        "Basic compression",
        "Convert to common formats",
        "File size limit: 10MB",
        "3 operations per day",
      ],
      cta: "Coming Soon",
    },
    {
      name: "Pro",
      description: "Advanced features for regular users",
      price: {
        monthly: 1000,
        annual: 700, 
      },
      features: [
        "Unlimited PDF merging",
        "Advanced PDF splitting",
        "High-quality compression",
        "Convert to all formats",
        "Add text watermarks",
        "File size limit: 100MB",
        "Unlimited operations",
        "No ads",
      ],
      cta: "Coming Soon",
      popular: true,
    },
    {
      name: "Business",
      description: "Complete solution for teams",
      price: {
        monthly: 2000, 
        annual: 1500, 
      },
      features: [
        "Everything in Pro",
        "Team management",
        "API access",
        "Batch processing",
        "Custom watermarks",
        "File size limit: 500MB",
        "Priority support",
        "Custom branding",
      ],
      cta: "Coming Soon",
    },
  ]

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName)

    // If user is not logged in, redirect to signup
    if (!auth.user) {
      router.push("/signup?plan=" + planName.toLowerCase())
      return
    }

    // If user is logged in, redirect to checkout or account page
    router.push("/account/billing?plan=" + planName.toLowerCase() + "&cycle=" + billingCycle)
  }

  return (
    <SiteLayout>
      <div className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for you and start transforming your PDF experience today.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <Tabs defaultValue="monthly" className="mb-4">
            <TabsList>
              <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
                Monthly
              </TabsTrigger>
              <TabsTrigger value="annual" onClick={() => setBillingCycle("annual")}>
                Annual
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Switch
              id="annual-billing"
              checked={billingCycle === "annual"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
            />
            <Label htmlFor="annual-billing" className="text-sm">
              Pay annually and save up to 20%
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.annual

            return (
              <Card
                key={plan.name}
                className={`flex flex-col ${plan.popular ? "border-primary shadow-lg relative" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{price} NPR</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "month" : "month, billed annually"}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                    disabled
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade, downgrade, or cancel your plan at any time from your account settings.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day free trial on all paid plans. No credit card required to try.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, PayPal, and Apple Pay.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I get a refund?</h3>
              <p className="text-muted-foreground">We offer a 14-day money-back guarantee on all paid plans.</p>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
