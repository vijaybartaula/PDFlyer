"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SiteLayout from "@/components/site-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Calendar, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BillingPage() {
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal">("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = useAuth()
  const { toast } = useToast()

  const plan = searchParams.get("plan") || "pro"
  const cycle = searchParams.get("cycle") || "monthly"

  // Only run auth-dependent code after component is mounted on the client
  useEffect(() => {
    setMounted(true)

    // Check authentication after mounting
    if (mounted && !auth.isLoading && !auth.user) {
      router.push("/login?redirect=/account/billing")
    }
  }, [auth.isLoading, auth.user, mounted, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    // Validate form
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        setError("Please fill in all card details")
        setIsProcessing(false)
        return
      }

      // Basic validation
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid card number")
        setIsProcessing(false)
        return
      }
    }

    try {
      // Simulate API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      toast({
        title: "Subscription updated!",
        description: `You are now subscribed to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Error processing payment:", err)
      setError("An error occurred while processing your payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format card expiry date
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Show loading state while checking authentication
  if (!mounted || auth.isLoading || !auth.user) {
    return (
      <SiteLayout>
        <div className="container py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  const planDetails = {
    free: {
      name: "Free",
      price: { monthly: 0, annual: 0 },
    },
    pro: {
      name: "Pro",
      price: { monthly: 9.99, annual: 95.88 }, // 7.99 * 12
    },
    business: {
      name: "Business",
      price: { monthly: 19.99, annual: 203.88 }, // 16.99 * 12
    },
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro
  const price = cycle === "monthly" ? selectedPlan.price.monthly : selectedPlan.price.annual

  return (
    <SiteLayout>
      <div className="container max-w-4xl py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Subscription & Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="credit-card" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="credit-card" onClick={() => setPaymentMethod("credit-card")}>
                        Credit Card
                      </TabsTrigger>
                      <TabsTrigger value="paypal" onClick={() => setPaymentMethod("paypal")}>
                        PayPal
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="credit-card" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="pl-10"
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Smith"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <div className="relative">
                            <Input
                              id="card-expiry"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                              maxLength={5}
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="card-cvc">CVC</Label>
                          <Input
                            id="card-cvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="paypal" className="mt-4">
                      <div className="flex flex-col items-center justify-center p-6 border rounded-md">
                        <img src="/placeholder.svg?height=60&width=150" alt="PayPal" className="mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          You will be redirected to PayPal to complete your payment.
                        </p>
                        <Button type="button" className="w-full">
                          Continue with PayPal
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Billing Cycle</h3>
                      <RadioGroup defaultValue={cycle} className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual">Annual (Save 20%)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing
                        ? "Processing..."
                        : `Subscribe for $${price.toFixed(2)}${cycle === "monthly" ? "/month" : "/year"}`}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By subscribing, you agree to our{" "}
                      <a href="/terms" className="underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>
                    {selectedPlan.name} Plan ({cycle})
                  </span>
                  <span>${price.toFixed(2)}</span>
                </div>

                {cycle === "annual" && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Savings</span>
                    <span className="text-green-600">
                      -$${(selectedPlan.price.monthly * 12 - selectedPlan.price.annual).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${price.toFixed(2)}
                    {cycle === "monthly" ? "/month" : "/year"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <h4 className="font-medium">What's included:</h4>
                <ul className="text-sm space-y-1">
                  {plan === "pro" ? (
                    <>
                      <li>✓ Unlimited PDF merging</li>
                      <li>✓ Advanced PDF splitting</li>
                      <li>✓ High-quality compression</li>
                      <li>✓ Convert to all formats</li>
                      <li>✓ File size limit: 100MB</li>
                    </>
                  ) : plan === "business" ? (
                    <>
                      <li>✓ Everything in Pro</li>
                      <li>✓ Team management</li>
                      <li>✓ API access</li>
                      <li>✓ Batch processing</li>
                      <li>✓ File size limit: 500MB</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Basic PDF tools</li>
                      <li>✓ File size limit: 10MB</li>
                      <li>✓ 3 operations per day</li>
                    </>
                  )}
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
