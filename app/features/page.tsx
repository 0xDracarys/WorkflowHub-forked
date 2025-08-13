import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { 
  Workflow, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Calendar, 
  CreditCard,
  Shield,
  Zap,
  Globe,
  Target,
  CheckCircle,
  ArrowRight,
  Settings,
  FileText,
  Clock,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Workflow,
      title: "Visual Workflow Builder",
      description: "Create custom client journeys with our intuitive drag-and-drop interface. Design every touchpoint from discovery to delivery.",
      benefits: [
        "Drag-and-drop step creation",
        "Conditional logic and branching",
        "Template library included",
        "Real-time preview mode"
      ],
      color: "from-violet-600 to-violet-700"
    },
    {
      icon: Users,
      title: "Client Management Hub",
      description: "Centralized dashboard to track all client interactions, progress, and communications in one place.",
      benefits: [
        "Client progress tracking",
        "Communication history",
        "Document management",
        "Activity timeline"
      ],
      color: "from-emerald-600 to-emerald-700"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive reporting and analytics to optimize your workflows and track business performance.",
      benefits: [
        "Conversion rate tracking",
        "Revenue analytics",
        "Client satisfaction metrics",
        "Workflow performance insights"
      ],
      color: "from-navy-600 to-navy-700"
    }
  ]

  const automationFeatures = [
    {
      icon: MessageSquare,
      title: "Automated Communications",
      description: "Send personalized emails, reminders, and follow-ups automatically based on workflow triggers."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Integrated calendar management with automated booking confirmations and reminders."
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Secure, automated payment collection with milestone-based billing and invoicing."
    },
    {
      icon: FileText,
      title: "Document Automation",
      description: "Generate contracts, proposals, and reports automatically from workflow templates."
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with data encryption, GDPR compliance, and access controls."
    },
    {
      icon: Globe,
      title: "Multi-Channel Integration",
      description: "Connect with your existing tools and platforms for seamless workflow management."
    }
  ]

  const businessBenefits = [
    {
      icon: Target,
      title: "Increase Conversion Rates",
      description: "Streamlined workflows convert more prospects into paying clients",
      stat: "Up to 40% higher conversion"
    },
    {
      icon: Clock,
      title: "Save Time Daily",
      description: "Automation eliminates repetitive tasks and administrative overhead",
      stat: "Save 2-4 hours per day"
    },
    {
      icon: TrendingUp,
      title: "Scale Your Business",
      description: "Handle more clients without increasing operational complexity",
      stat: "Serve 3x more clients"
    },
    {
      icon: Zap,
      title: "Faster Client Delivery",
      description: "Optimized processes ensure faster project completion times",
      stat: "30% faster delivery"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-navy-100 rounded-full text-sm font-semibold text-navy-700 border border-violet-200 mb-6">
            <Settings className="w-4 h-4 mr-2 text-violet-600" />
            Complete Feature Overview
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-navy-700 bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h1>
          
          <p className="text-xl text-navy-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Discover how WorkflowHub transforms your business operations with powerful automation, 
            intelligent insights, and seamless client management capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Core Platform Features</h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              The essential tools you need to transform your business operations and client experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="p-8 border-navy-100 hover:shadow-xl transition-all duration-300 hover:border-violet-200">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-navy-900 mb-4">{feature.title}</h3>
                <p className="text-navy-600 leading-relaxed mb-6">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-navy-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-900 via-navy-800 to-violet-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/90 border border-white/20 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Automation & Integration
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">Intelligent Automation</h2>
            <p className="text-xl text-navy-200 max-w-2xl mx-auto">
              Let WorkflowHub handle the routine tasks while you focus on growing your business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {automationFeatures.map((feature, index) => (
              <Card key={index} className="p-8 bg-white/95 backdrop-blur-sm border-navy-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-navy-700 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                <p className="text-navy-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Measurable Business Impact</h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              See real results from day one with these proven business benefits
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {businessBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center border-navy-100 hover:shadow-lg transition-all duration-300 hover:border-violet-200">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-navy-900 mb-2">{benefit.title}</h3>
                <p className="text-navy-600 text-sm mb-3">{benefit.description}</p>
                <Badge className="bg-violet-100 text-violet-700 font-semibold">{benefit.stat}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-navy-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-violet-100 mb-8">
            Join thousands of professionals who have streamlined their operations with WorkflowHub
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button 
                size="lg"
                className="bg-white text-violet-700 hover:bg-violet-50 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-violet-700 px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
