import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Settings, MessageSquare, FileText, Calendar, CreditCard, CheckCircle } from "lucide-react"

export function WorkflowShowcase() {
  const workflowSteps = [
    { id: 1, title: "Intake Form", icon: FileText, description: "Collect client requirements", color: "bg-violet-500" },
    { id: 2, title: "Strategy Call", icon: Calendar, description: "30-min consultation", color: "bg-emerald-500" },
    {
      id: 3,
      title: "Proposal Review",
      icon: MessageSquare,
      description: "Client approval process",
      color: "bg-navy-500",
    },
    { id: 4, title: "Payment", icon: CreditCard, description: "Secure payment collection", color: "bg-violet-600" },
    { id: 5, title: "Delivery", icon: CheckCircle, description: "Final deliverable", color: "bg-emerald-600" },
  ]

  return (
    <section
      id="workflow"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-900 via-navy-800 to-violet-900"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/90 border border-white/20">
            <Settings className="w-4 h-4 mr-2" />
            Your Customizable Workflow Engine
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Build Your Perfect{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Client Journey
            </span>
          </h2>

          <p className="text-xl text-navy-200 max-w-3xl mx-auto leading-relaxed">
            Drag, drop, and customize every step of your client experience. From initial contact to final delivery,
            create workflows that convert followers into paying customers automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Visual Workflow Builder</h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Drag & Drop Interface",
                    description: "Visually design your client journey with our intuitive builder",
                    icon: Settings,
                  },
                  {
                    title: "Smart Automation",
                    description: "Trigger actions, send emails, and move clients automatically",
                    icon: ArrowRight,
                  },
                  {
                    title: "Custom Forms & Pages",
                    description: "Create branded intake forms, contracts, and payment pages",
                    icon: FileText,
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-navy-300 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white shadow-xl group"
            >
              Try Workflow Builder
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="relative">
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-navy-200 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-navy-900">Professional Service Workflow</h4>
                  <Button size="sm" variant="outline" className="text-violet-600 border-violet-200 bg-transparent">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className="flex items-center space-x-4 p-4 bg-navy-50 rounded-xl hover:bg-navy-100 transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center`}>
                          <step.icon className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-navy-900 group-hover:text-violet-700 transition-colors">
                            {step.title}
                          </div>
                          <div className="text-sm text-navy-500">{step.description}</div>
                        </div>

                        <div className="w-6 h-6 bg-white border-2 border-navy-200 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-violet-500 rounded-full" />
                        </div>
                      </div>

                      {index < workflowSteps.length - 1 && (
                        <div className="absolute left-9 top-16 w-0.5 h-4 bg-gradient-to-b from-navy-200 to-violet-200" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                  <div className="text-sm text-navy-600">
                    <span className="font-semibold">24 clients</span> in this workflow
                  </div>
                  <div className="text-sm text-emerald-600 font-semibold">92% completion rate</div>
                </div>
              </div>
            </Card>

            {/* Floating completion animation */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse-glow">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
