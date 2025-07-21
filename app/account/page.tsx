"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SiteLayout from "@/components/site-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, CreditCard, Bell, Shield, LogOut } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()

  // Only run auth-dependent code after component is mounted on the client
  useEffect(() => {
    setMounted(true)

    // Check authentication after mounting
    if (mounted && !auth.isLoading && !auth.user) {
      router.push("/login?redirect=/account")
    } else if (mounted && auth.user) {
      // Set initial values from user data
      setEmail(auth.user.email || "")
      // In a real app, you would fetch the user's profile from your database
    }
  }, [auth.isLoading, auth.user, mounted, router])

  const handleSaveProfile = () => {
    // In a real app, you would update the user's profile in your database
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleSaveNotifications = () => {
    // In a real app, you would update the user's notification preferences
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  const handleSignOut = async () => {
    await auth.signOut()
    router.push("/")
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

  return (
    <SiteLayout>
      <div className="container max-w-5xl py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarFallback className="text-2xl">
                  {auth.user?.email?.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-lg">{name || auth.user.email?.split("@")[0]}</h2>
              <p className="text-sm text-muted-foreground">{auth.user.email}</p>
            </div>

            <nav className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "billing" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("security")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Current Plan</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Free Plan</span>
                        <span className="text-primary">Free</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        You are currently on the Free plan with limited features.
                      </p>
                      <Button asChild>
                        <Link href="/pricing">Upgrade Plan</Link>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground mb-4">You don't have any payment methods saved yet.</p>
                    <Button variant="outline" asChild>
                      <Link href="/account/billing">Add Payment Method</Link>
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Billing History</h3>
                    <p className="text-sm text-muted-foreground">You don't have any billing history yet.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how we contact you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity and PDF processing.
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-emails" className="font-medium">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features, tips, and special offers.
                      </p>
                    </div>
                    <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. This action is permanent.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
