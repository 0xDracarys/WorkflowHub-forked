"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Bell, Shield, CreditCard, Save } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { user } = useUser()
  const [displayName, setDisplayName] = useState(user?.firstName || "")
  const [email, setEmail] = useState(user?.emailAddresses[0]?.emailAddress || "")
  const [bio, setBio] = useState("")

  useEffect(() => {
    setDisplayName(user?.firstName || "")
    setEmail(user?.emailAddresses[0]?.emailAddress || "")
    setBio(user?.publicMetadata.bio || "")
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await user.update({
        firstName: displayName,
        emailAddress: email, // Clerk handles email updates/verifications
        publicMetadata: { bio },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-navy-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-navy-600 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Settings</h1>
          <p className="text-navy-600">Manage your account and workflow preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="p-6 border-navy-100">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl font-semibold text-navy-900">Profile Settings</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-navy-700 font-medium">Display Name</Label>
                  <Input placeholder="Sarah Chen" className="mt-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium">Email</Label>
                  <Input placeholder="sarah@example.com" className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-navy-700 font-medium">Bio</Label>
                  <Textarea placeholder="Tell clients about your expertise..." className="mt-2 min-h-[100px]" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>
              {/* Save Button */}
              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 border-navy-100">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="w-5 h-5 text-violet-600" />
              <h2 className="text-xl font-semibold text-navy-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-navy-900 font-medium">New Client Applications</Label>
                  <p className="text-sm text-navy-600">Get notified when someone applies to your workflows</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-navy-900 font-medium">Client Messages</Label>
                  <p className="text-sm text-navy-600">Receive notifications for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-navy-900 font-medium">Payment Updates</Label>
                  <p className="text-sm text-navy-600">Get notified about payment milestones</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Coming Soon Placeholders */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-navy-100">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-semibold text-navy-900">Security</h2>
              </div>
              <p className="text-navy-600 mb-4">Manage your password, two-factor authentication, and connected devices.</p>
              <Link href="https://dashboard.clerk.com/apps/APP_ID/users" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Go to Security Settings
                </Button>
              </Link>
            </Card>

            <Card className="p-6 border-navy-100">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-violet-600" />
                <h2 className="text-xl font-semibold text-navy-900">Billing</h2>
              </div>
              <p className="text-navy-600 mb-4">View your subscription, payment methods, and billing history.</p>
              <Button variant="outline" className="w-full" disabled>
                Billing Portal (Coming Soon)
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
