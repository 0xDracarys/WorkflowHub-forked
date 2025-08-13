import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Workflow, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-navy-100 rounded-full text-sm font-semibold text-navy-700 border border-violet-200">
                <Workflow className="w-4 h-4 mr-2 text-violet-600" />
                The Professional Workflow Engine
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-violet-600 to-navy-700 bg-clip-text text-transparent">
                  Influence
                </span>{" "}
                Into Systematic Success
              </h1>

              <p className="text-xl text-navy-600 leading-relaxed">
                The only platform that turns your personal brand into a professional service business with customizable
                workflows, automated client management, and data-driven insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group px-8 py-4"
                >
                  Build Your Workflow
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/hub/sarahchen">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-navy-200 text-navy-700 hover:bg-navy-50 group bg-transparent px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  See It In Action
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-navy-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy-900">10,000+</div>
                <div className="text-sm text-navy-600">Professionals Served</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy-900">99.5%</div>
                <div className="text-sm text-navy-600">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy-900">24/7</div>
                <div className="text-sm text-navy-600">Support Available</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-200/20 to-navy-200/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-navy-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-navy-700 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy-900">Professional Hub</div>
                      <div className="text-sm text-navy-500">Service Business</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-600">Active Workflows</span>
                    <span className="font-semibold text-navy-900">8 Running</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: "Client Onboarding", clients: 12, color: "bg-violet-500" },
                      { name: "Service Delivery", clients: 8, color: "bg-emerald-500" },
                      { name: "Follow-up Process", clients: 6, color: "bg-navy-500" },
                    ].map((workflow, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-navy-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${workflow.color}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-navy-900">{workflow.name}</div>
                          <div className="text-xs text-navy-500">{workflow.clients} active clients</div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900">$47K</div>
                    <div className="text-sm text-navy-500">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-navy-900">4.9★</div>
                    <div className="text-sm text-navy-500">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
