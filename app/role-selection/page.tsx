"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Heart,
  Briefcase,
  UserCheck,
  Crown,
  Building2,
  Sparkles
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: "service_provider",
      title: "Service Provider",
      subtitle: "Share your expertise",
      description: "Offer your skills and knowledge to help clients achieve their goals through structured workflows",
      icon: Briefcase,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      features: [
        "Create custom workflows for your services",
        "Manage client pipelines efficiently", 
        "Set milestone-based payments",
        "Build your professional reputation",
        "Automated client onboarding"
      ],
      examples: [
        "Business Consultants",
        "Immigration Lawyers", 
        "Career Coaches",
        "Marketing Experts",
        "Financial Advisors"
      ],
      stats: {
        users: "15K+",
        avgEarning: "$85K",
        satisfaction: "4.9/5"
      }
    },
    {
      id: "service_receiver", 
      title: "Service Receiver",
      subtitle: "Get expert help",
      description: "Connect with top professionals and access their structured workflows to achieve your goals",
      icon: Target,
      color: "from-violet-500 to-violet-600", 
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      features: [
        "Browse curated service providers",
        "Follow step-by-step workflows", 
        "Track your progress in real-time",
        "Secure milestone-based payments",
        "Direct communication with experts"
      ],
      examples: [
        "Students seeking visa help",
        "Entrepreneurs needing business guidance",
        "Professionals wanting career growth", 
        "Companies seeking marketing strategies",
        "Individuals needing financial planning"
      ],
      stats: {
        success: "94%",
        avgTime: "3.2x faster",
        satisfaction: "4.8/5"
      }
    },
    {
      id: "agency_influencer",
      title: "Agency / Influencer", 
      subtitle: "Scale and amplify",
      description: "Connect service providers with clients, build your network, and earn through partnerships",
      icon: Crown,
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50", 
      borderColor: "border-indigo-200",
      features: [
        "Build your trust portfolio",
        "Partner with top service providers",
        "Earn referral commissions",
        "Create influencer workflows",
        "Advanced analytics and insights"
      ],
      examples: [
        "Social Media Influencers",
        "Business Networks",
        "Educational Consultants",
        "Agency Partners", 
        "Community Leaders"
      ],
      stats: {
        network: "50K+",
        commission: "15-25%",
        growth: "+180%"
      }
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    
    // Route to appropriate onboarding flow
    switch(roleId) {
      case "service_provider":
        router.push("/onboarding/provider")
        break
      case "service_receiver": 
        router.push("/browse/services")
        break
      case "agency_influencer":
        router.push("/onboarding/influencer")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-navy-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-navy-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
                WorkflowHub
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 rounded-full text-sm font-semibold text-navy-700 border border-navy-200/50 mb-6">
            <Users className="w-4 h-4 mr-2" />
            Choose Your Journey
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
            What brings you to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-navy-700 bg-clip-text text-transparent">
              WorkflowHub?
            </span>
          </h1>
          
          <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're here to share your expertise, get professional help, or build partnerships, 
            we've designed the perfect experience for your needs.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className={`p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                selectedRole === role.id 
                  ? `${role.borderColor} shadow-xl scale-105` 
                  : "border-navy-100 hover:border-navy-200"
              } ${role.bgColor} group`}
              onClick={() => setSelectedRole(role.id)}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">{role.title}</h3>
                <p className="text-navy-600 font-medium">{role.subtitle}</p>
                <p className="text-navy-500 mt-2 leading-relaxed">{role.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                {Object.entries(role.stats).map(([key, value]) => (
                  <div key={key} className="bg-white/60 rounded-lg p-3">
                    <div className="font-bold text-navy-900">{value}</div>
                    <div className="text-xs text-navy-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-navy-900 mb-3">Key Features:</h4>
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-navy-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Examples */}
              <div className="mb-8">
                <h4 className="font-semibold text-navy-900 mb-3">Perfect for:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.examples.slice(0, 3).map((example, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs bg-white/60 text-navy-600 border-navy-200"
                    >
                      {example}
                    </Badge>
                  ))}
                  {role.examples.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-white/60 text-navy-600 border-navy-200">
                      +{role.examples.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full bg-gradient-to-r ${role.color} hover:shadow-lg transition-all text-white`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRoleSelect(role.id)
                }}
              >
                Get Started as {role.title.split(' ')[0]}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-8 px-8 py-6 bg-white/60 rounded-2xl border border-navy-100 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-navy-700">
              <Shield className="w-6 h-6 text-emerald-500" />
              <span className="font-semibold">Bank-level Security</span>
            </div>
            <div className="w-px h-8 bg-navy-200" />
            <div className="flex items-center space-x-2 text-navy-700">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="w-px h-8 bg-navy-200" />
            <div className="flex items-center space-x-2 text-navy-700">
              <TrendingUp className="w-6 h-6 text-violet-500" />
              <span className="font-semibold">95% Success Rate</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
