"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Award,
  Shield,
  MessageCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function InfluencerHubTemplate() {
  // This is a template page showing how an influencer's hub should look
  const templateInfluencer = {
    name: "Your Name Here",
    title: "Your Professional Title",
    avatar: "/placeholder-avatar.svg",
    rating: 0.0,
    reviewCount: 0,
    bio: "Write your professional bio here. Describe your expertise, experience, and what makes you unique.",
    experience: "Your experience",
    clientsServed: "0",
    credentials: "Your credentials",
    socialLinks: {
      website: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#"
    }
  }

  const templateWorkflows = [
    {
      id: "template-1",
      title: "Your First Service",
      description: "Describe what this service includes and how it helps your clients achieve their goals.",
      price: "$XXX",
      duration: "X weeks",
      steps: 5,
      completionRate: 0,
      clients: 0,
      rating: 0.0,
      popular: true,
      features: [
        "Feature 1 - what you'll provide",
        "Feature 2 - another benefit",
        "Feature 3 - additional value",
        "Feature 4 - ongoing support",
      ],
      icon: FileText,
      color: "from-violet-500 to-violet-600",
    },
    {
      id: "template-2",
      title: "Your Second Service",
      description: "Describe your premium or intensive service offering with more detailed support.",
      price: "$XXX",
      duration: "X weeks",
      steps: 6,
      completionRate: 0,
      clients: 0,
      rating: 0.0,
      popular: false,
      features: [
        "Premium feature 1",
        "Premium feature 2",
        "Premium feature 3",
        "Premium feature 4",
      ],
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "template-3",
      title: "Quick Consultation",
      description: "Offer a shorter, more accessible option for clients who need quick guidance.",
      price: "$XX",
      duration: "30 minutes",
      steps: 2,
      completionRate: 0,
      clients: 0,
      rating: 0.0,
      popular: false,
      features: [
        "Focused session",
        "Expert guidance",
        "Actionable steps",
        "Follow-up resources",
      ],
      icon: MessageCircle,
      color: "from-navy-500 to-navy-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Template Notice */}
      <div className="bg-violet-100 border-b border-violet-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-violet-800 text-sm font-medium">
              This is a template page. Create your own profile to customize this experience.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-navy-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={templateInfluencer.avatar}
                alt={templateInfluencer.name}
                className="w-16 h-16 rounded-full border-2 border-violet-200 bg-gray-100"
              />
              <div>
                <h1 className="text-2xl font-bold text-navy-900">{templateInfluencer.name}</h1>
                <p className="text-navy-600">{templateInfluencer.title}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">{templateInfluencer.rating} ({templateInfluencer.reviewCount} reviews)</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600">Setup Required</Badge>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <a href={templateInfluencer.socialLinks.website} className="text-gray-400 hover:text-violet-600 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href={templateInfluencer.socialLinks.instagram} className="text-gray-400 hover:text-violet-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={templateInfluencer.socialLinks.twitter} className="text-gray-400 hover:text-violet-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={templateInfluencer.socialLinks.linkedin} className="text-gray-400 hover:text-violet-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bio Section */}
        <Card className="p-8 mb-8 border-navy-100">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">
              Your professional headline goes here
            </h2>
            <p className="text-navy-600 leading-relaxed mb-6">
              {templateInfluencer.bio}
            </p>

            <div className="flex items-center justify-center space-x-8 text-sm text-navy-500">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-400" />
                <span>{templateInfluencer.experience}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{templateInfluencer.clientsServed} Clients Served</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>{templateInfluencer.credentials}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Services Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Your Services</h2>
            <p className="text-navy-600 max-w-2xl mx-auto">
              Create workflows for your services. Each workflow guides clients through your proven process.
            </p>
          </div>

          <div className="grid gap-6">
            {templateWorkflows.map((workflow) => (
              <Card key={workflow.id} className="p-8 hover:shadow-xl transition-all duration-300 border-navy-100 group opacity-75">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${workflow.color} rounded-2xl flex items-center justify-center opacity-60`}
                    >
                      <workflow.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-2xl font-bold text-navy-900">{workflow.title}</h3>
                        {workflow.popular && <Badge className="bg-violet-100 text-violet-700">Template</Badge>}
                      </div>
                      <p className="text-navy-600 leading-relaxed mb-4">{workflow.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-500">{workflow.price}</div>
                          <div className="text-sm text-navy-500">Price</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-500">{workflow.duration}</div>
                          <div className="text-sm text-navy-500">Timeline</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-500">{workflow.completionRate}%</div>
                          <div className="text-sm text-navy-500">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="w-4 h-4 text-gray-400" />
                            <span className="text-xl font-bold text-gray-500">{workflow.rating}</span>
                          </div>
                          <div className="text-sm text-navy-500">{workflow.clients} clients</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-navy-900 mb-3">What's included:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {workflow.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-navy-600 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-navy-100">
                  <div className="flex items-center space-x-4 text-sm text-navy-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{workflow.steps} steps</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{workflow.clients} completed</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled
                    className="bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Template Only
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Setup CTA */}
        <Card className="p-8 bg-gradient-to-br from-violet-50 to-navy-50 border-violet-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Ready to Create Your Own Hub?</h3>
            <p className="text-navy-600 mb-6 max-w-2xl mx-auto">
              This template shows how your profile will look. Sign up to create your own personalized workflow hub 
              and start building your business with proven systems.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/workflow/builder">
                <Button size="lg" variant="outline" className="border-navy-200 text-navy-600 hover:bg-navy-50">
                  Create Workflow
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
