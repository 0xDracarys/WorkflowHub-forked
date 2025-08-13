import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageCircle, Calendar, ArrowRight, Users, DollarSign } from "lucide-react"

export function DashboardPreview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-50 to-violet-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-navy-900">Your Workflow Command Center</h2>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Monitor all client workflows in real-time. See exactly where each client is in their journey and what
            actions to take next.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-navy-200 overflow-hidden">
          <div className="bg-gradient-to-r from-navy-800 to-violet-800 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-2xl font-bold">Workflow Pipeline</h3>
                <p className="opacity-90">Active workflows • Clients in progress • Revenue tracking</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  This Week
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              {[
                { stage: "Discovery", count: 12, color: "bg-violet-500", amount: "$3,200" },
                { stage: "In Progress", count: 18, color: "bg-emerald-500", amount: "$5,400" },
                { stage: "Review", count: 8, color: "bg-navy-500", amount: "$2,800" },
                { stage: "Completed", count: 9, color: "bg-violet-600", amount: "$1,000" },
              ].map((stage, index) => (
                <Card key={index} className="p-6 border-navy-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-navy-900">{stage.stage}</h4>
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-navy-900">{stage.count}</div>
                    <div className="text-sm text-navy-500">clients</div>
                    <div className="text-sm font-semibold text-emerald-600">{stage.amount}</div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-navy-900">Active Client Workflows</h4>
                  <Button variant="outline" size="sm" className="text-violet-600 border-violet-200 bg-transparent">
                    View All Workflows
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      client: "Client A",
                      workflow: "Professional Service",
                      stage: "Discovery Phase",
                      progress: 35,
                      nextAction: "Schedule follow-up",
                      amount: "$2,500",
                      avatar: "/client-avatar-1.png",
                      stageColor: "bg-emerald-500",
                    },
                    {
                      client: "Client B",
                      workflow: "Consultation Service",
                      stage: "Document Review",
                      progress: 75,
                      nextAction: "Send final report",
                      amount: "$800",
                      avatar: "/client-avatar-2.png",
                      stageColor: "bg-navy-500",
                    },
                    {
                      client: "Client C",
                      workflow: "Advisory Service",
                      stage: "Proposal Sent",
                      progress: 15,
                      nextAction: "Follow up on proposal",
                      amount: "$1,200",
                      avatar: "/client-avatar-3.png",
                      stageColor: "bg-violet-500",
                    },
                  ].map((client, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-navy-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={client.avatar || "/placeholder.svg"}
                            alt={client.client}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h5 className="font-semibold text-navy-900">{client.client}</h5>
                            <p className="text-sm text-navy-500">{client.workflow}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-semibold text-navy-900">{client.amount}</div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${client.stageColor}`} />
                              <span className="text-sm text-navy-500">{client.stage}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-navy-600">Workflow Progress</span>
                          <span className="text-navy-900 font-medium">{client.progress}%</span>
                        </div>
                        <Progress value={client.progress} className="h-2" />

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-navy-600">
                            Next: <span className="font-medium text-navy-900">{client.nextAction}</span>
                          </div>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-violet-50 to-navy-50 border-violet-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-navy-900">Performance Metrics</h4>
                    <DollarSign className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-navy-900">$47,200</div>
                      <div className="text-sm text-navy-600">Revenue This Month</div>
                      <div className="text-sm text-emerald-600 font-medium">+23% vs last month</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-navy-900">94%</div>
                        <div className="text-navy-600">Completion Rate</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">4.9★</div>
                        <div className="text-navy-600">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-navy-900">Quick Actions</h4>
                    <Users className="w-5 h-5 text-navy-400" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { action: "Follow up with pending clients", urgent: true },
                      { action: "Review completed workflows", urgent: false },
                      { action: "Update service pricing", urgent: false },
                      { action: "Schedule team check-in", urgent: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${item.urgent ? "bg-violet-500" : "bg-navy-300"}`} />
                          <div className="text-sm text-navy-900">{item.action}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-navy-400" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
