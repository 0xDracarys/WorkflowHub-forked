import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Workflow, 
  BarChart3,
  Crown,
  Zap,
  Shield,
  HeadphonesIcon,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for freelancers and solo professionals getting started",
      price: "29",
      period: "month",
      badge: null,
      features: [
        "Up to 3 active workflows",
        "50 client interactions per month",
        "Basic email automation",
        "Standard templates library",
        "Email support",
        "Basic analytics dashboard",
        "Document management (1GB)",
        "Mobile app access"
      ],
      limitations: [
        "No custom branding",
        "No advanced integrations",
        "No API access"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-navy-600 to-navy-700"
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses and established consultants",
      price: "79",
      period: "month", 
      badge: "Most Popular",
      features: [
        "Unlimited workflows",
        "500 client interactions per month",
        "Advanced automation & triggers",
        "Custom workflow templates",
        "Priority email & chat support",
        "Advanced analytics & reporting",
        "Document management (10GB)",
        "Custom branding",
        "Payment processing integration",
        "Calendar scheduling",
        "Team collaboration (up to 3 users)",
        "Mobile app with offline access"
      ],
      limitations: [
        "No white-label solution",
        "No dedicated account manager"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-violet-600 to-violet-700"
    },
    {
      name: "Enterprise",
      description: "Comprehensive solution for large teams and organizations",
      price: "199",
      period: "month",
      badge: "Best Value",
      features: [
        "Everything in Professional",
        "Unlimited client interactions",
        "White-label solution",
        "Custom integrations & API access",
        "Dedicated account manager",
        "Phone support with SLA",
        "Advanced security & compliance",
        "Document management (100GB)",
        "Unlimited team members",
        "Advanced workflow analytics",
        "Custom training sessions",
        "Priority feature requests",
        "Multi-location support",
        "Advanced role-based permissions"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "from-emerald-600 to-emerald-700"
    }
  ]

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges accordingly."
    },
    {
      question: "What's included in the free trial?",
      answer: "All plans include a 14-day free trial with full access to all features in that plan. No credit card required to start."
    },
    {
      question: "Do you offer annual discounts?",
      answer: "Yes, annual subscriptions receive a 20% discount. You can switch to annual billing from your account settings."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer email support for all plans, chat support for Professional plans, and phone support with SLA for Enterprise plans."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. Enterprise customers receive complimentary onboarding and training sessions."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription anytime. Your account remains active until the end of the billing cycle."
    }
  ]

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption"
    },
    {
      icon: Zap,
      title: "99.9% Uptime SLA",
      description: "Guaranteed reliability with comprehensive monitoring"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock assistance when you need it"
    },
    {
      icon: Clock,
      title: "Fast Implementation",
      description: "Get up and running in less than 24 hours"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-navy-100 rounded-full text-sm font-semibold text-navy-700 border border-violet-200 mb-6">
            <Crown className="w-4 h-4 mr-2 text-violet-600" />
            Simple, Transparent Pricing
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-navy-700 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          
          <p className="text-xl text-navy-600 leading-relaxed mb-8">
            Start with a 14-day free trial. No credit card required. 
            Scale up as your business grows with flexible pricing that adapts to your needs.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <Badge className="bg-emerald-100 text-emerald-700">14-Day Free Trial</Badge>
            <Badge className="bg-violet-100 text-violet-700">No Setup Fees</Badge>
            <Badge className="bg-navy-100 text-navy-700">Cancel Anytime</Badge>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 border-navy-100 hover:shadow-2xl transition-all duration-300 relative ${
                  plan.popular ? 'border-violet-200 shadow-xl scale-105' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-2">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{plan.name}</h3>
                  <p className="text-navy-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-navy-900">${plan.price}</span>
                    <span className="text-navy-600">/{plan.period}</span>
                  </div>

                  <Link href="/auth">
                    <Button 
                      className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all duration-300`}
                      size="lg"
                    >
                      {plan.cta}
                      {plan.cta !== "Contact Sales" && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-3">Included Features:</h4>
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-navy-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-navy-100">
                      <h4 className="font-semibold text-navy-900 mb-3">Not Included:</h4>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="text-navy-500 text-sm">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-900 via-navy-800 to-violet-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose WorkflowHub?</h2>
            <p className="text-xl text-navy-200 max-w-2xl mx-auto">
              Every plan includes these enterprise-grade features and benefits
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="p-6 bg-white/95 backdrop-blur-sm border-navy-200 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-navy-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-navy-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-navy-600">
              Get answers to the most common questions about our pricing and plans
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 border-navy-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-3">{faq.question}</h3>
                <p className="text-navy-600 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-navy-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-violet-100 mb-8">
            Join thousands of professionals who trust WorkflowHub to grow their business. 
            Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button 
                size="lg"
                className="bg-white text-violet-700 hover:bg-violet-50 shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
              >
                Start Your 14-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-violet-700 px-8 py-4"
            >
              Contact Sales Team
            </Button>
          </div>

          <p className="text-violet-200 text-sm mt-4">
            No credit card required • Cancel anytime • 24/7 support included
          </p>
        </div>
      </section>
    </div>
  )
}
