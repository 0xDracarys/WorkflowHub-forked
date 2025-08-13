"use client"

import { useState, useEffect } from "react"
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Bell,
  Settings,
  User,
  Copy,
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  MoreHorizontal,
  ArrowRight,
  Workflow,
  Share2,
  Filter,
  Eye,
  Edit,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { WorkflowShareModal } from "@/components/workflow/workflow-share-modal"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [workflows, setWorkflows] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [pipelineStats, setPipelineStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  const shareableLink = userProfile?.username ? `workflowhub.com/${userProfile.username}` : "workflowhub.com/profile"

  // Fetch user data and workflows
  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user profile
        const userResponse = await fetch('/api/users')
        const userData = await userResponse.json()
        
        if (userData.success) {
          setUserProfile(userData.data)
        }

        // Fetch user workflows
        const workflowResponse = await fetch('/api/workflows?type=user')
        const workflowData = await workflowResponse.json()
        
        if (workflowData.success) {
          setWorkflows(workflowData.data)
        } else {
          setError(workflowData.error || 'Failed to load workflows')
        }

        // Fetch client data
        const clientsResponse = await fetch('/api/clients')
        const clientsData = await clientsResponse.json()
        
        if (clientsData.success) {
          setClients(clientsData.data)
        }

        // Fetch pipeline statistics
        const statsResponse = await fetch('/api/clients?type=stats')
        const statsData = await statsResponse.json()
        
        if (statsData.success) {
          setPipelineStats(statsData.data)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoaded, user])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${shareableLink}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Calculate stats from real data
  const stats = [
    {
      title: "Total Workflows",
      value: workflows.length.toString(),
      change: `${workflows.filter(w => w.isPublic).length} published`,
      icon: Workflow,
      color: "from-violet-500 to-violet-600",
    },
    {
      title: "Total Usage",
      value: workflows.reduce((acc, w) => acc + (w.usageCount || 0), 0).toString(),
      change: "All time",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Avg Rating",
      value: workflows.length > 0 
        ? (workflows.reduce((acc, w) => acc + (w.rating || 0), 0) / workflows.length).toFixed(1)
        : "0.0",
      change: `${workflows.reduce((acc, w) => acc + (w.reviewCount || 0), 0)} reviews`,
      icon: Users,
      color: "from-navy-500 to-navy-600",
    },
    {
      title: "Categories",
      value: new Set(workflows.map(w => w.category).filter(Boolean)).size.toString(),
      change: "Unique types",
      icon: DollarSign,
      color: "from-emerald-600 to-violet-600",
    },
  ]

  // Format workflows for display
  const formatWorkflows = workflows.map(workflow => ({
    id: workflow._id,
    name: workflow.title,
    description: workflow.description,
    usage: workflow.usageCount || 0,
    rating: workflow.rating || 0,
    status: workflow.isPublic ? "active" : "draft",
    category: workflow.category || "General",
    link: `workflowhub.com/${userProfile?.username || 'user'}/${workflow._id}`,
    created: new Date(workflow.createdAt).toLocaleDateString(),
    steps: workflow.steps?.length || 0
  }))

  // Create real client pipeline from database data
  const clientPipeline = [
    {
      stage: "New Applications",
      clients: clients.filter(client => client.status === 'new').map(client => ({
        id: client._id,
        name: client.name,
        workflow: workflows.find(w => w._id === client.workflowId)?.title || 'Unknown Workflow',
        applied: new Date(client.createdAt).toLocaleDateString(),
        avatar: client.avatar || "/placeholder.svg",
        email: client.email
      })),
      color: "bg-violet-100 border-violet-200",
      headerColor: "bg-violet-500",
    },
    {
      stage: "In Progress",
      clients: clients.filter(client => client.status === 'in_progress').map(client => ({
        id: client._id,
        name: client.name,
        workflow: workflows.find(w => w._id === client.workflowId)?.title || 'Unknown Workflow',
        progress: client.progress || 0,
        avatar: client.avatar || "/placeholder.svg",
        email: client.email,
        currentStep: client.currentStep
      })),
      color: "bg-emerald-100 border-emerald-200",
      headerColor: "bg-emerald-500",
    },
    {
      stage: "Review & Approval",
      clients: clients.filter(client => client.status === 'review').map(client => ({
        id: client._id,
        name: client.name,
        workflow: workflows.find(w => w._id === client.workflowId)?.title || 'Unknown Workflow',
        review: client.currentStep || 'Pending Review',
        avatar: client.avatar || "/placeholder.svg",
        email: client.email
      })),
      color: "bg-navy-100 border-navy-200",
      headerColor: "bg-navy-500",
    },
    {
      stage: "Completed",
      clients: clients.filter(client => client.status === 'completed').map(client => ({
        id: client._id,
        name: client.name,
        workflow: workflows.find(w => w._id === client.workflowId)?.title || 'Unknown Workflow',
        completed: new Date(client.updatedAt).toLocaleDateString(),
        avatar: client.avatar || "/placeholder.svg",
        email: client.email
      })),
      color: "bg-emerald-50 border-emerald-200",
      headerColor: "bg-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-navy-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-navy-700 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
                  WorkflowHub
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-4 h-4" />
                <Input placeholder="Search clients..." className="pl-10 w-64 bg-navy-50 border-navy-200" />
              </div>

              <Link href="/workflow/builder">
                <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Workflow
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>
                <Link href="/google-integration">
                  <Button variant="ghost" size="sm" title="Google Integration">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-white shadow-lg border border-navy-100",
                      userButtonPopoverActionButton: "text-navy-600 hover:bg-navy-50",
                      userButtonPopoverActionButtonText: "text-navy-900",
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Welcome back, {userProfile?.firstName || user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-navy-600">
            You have {workflows.filter(w => w.isPublic).length} active workflows and {workflows.reduce((acc, w) => acc + (w.usageCount || 0), 0)} total usage
          </p>
        </div>

        {/* Shareable Link CTA */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-violet-600 to-navy-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Your Workflow Hub is Ready! 🚀</h2>
              <p className="text-violet-100 mb-4">
                Share this link in your bio to start getting clients through your workflows
              </p>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-sm font-mono">{shareableLink}</span>
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  {copiedLink ? (
                    <span>Copied!</span>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Link href="/hub/sarahchen">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Template
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <Share2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-white rounded-lg p-1 border border-navy-100">
          {[
            { id: "overview", label: "Overview" },
            { id: "clients", label: "Clients" },
            { id: "workflows", label: "Workflows" },
            { id: "payments", label: "Payments" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-violet-100 text-violet-700"
                  : "text-navy-600 hover:text-violet-600 hover:bg-navy-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-navy-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-navy-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
                      <p className="text-sm text-emerald-600 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Client Pipeline Kanban */}
            <Card className="p-6 mb-8 border-navy-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-navy-900">Client Pipeline</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-navy-600 border-navy-200 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Link href="/clients">
                    <Button variant="outline" size="sm" className="text-violet-600 border-violet-200 bg-transparent">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clientPipeline.map((column, columnIndex) => (
                  <div key={columnIndex} className={`rounded-lg border ${column.color} p-4`}>
                    <div
                      className={`${column.headerColor} text-white px-3 py-2 rounded-md mb-4 flex items-center justify-between`}
                    >
                      <h3 className="font-semibold text-sm">{column.stage}</h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{column.clients.length}</span>
                    </div>

                    <div className="space-y-3">
                      {column.clients.length === 0 ? (
                        <div className="text-center py-8 text-navy-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No clients yet</p>
                        </div>
                      ) : (
                        column.clients.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => setSelectedClient(client.id)}
                            className="bg-white p-3 rounded-lg border border-navy-100 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <img
                                src={client.avatar || "/placeholder.svg"}
                                alt={client.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-navy-900 text-sm group-hover:text-violet-700">
                                  {client.name}
                                </h4>
                                <p className="text-xs text-navy-500">{client.workflow}</p>
                              </div>
                            </div>

                            {client.progress !== undefined && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-navy-600">Progress</span>
                                  <span className="text-navy-900 font-medium">{client.progress}%</span>
                                </div>
                                <Progress value={client.progress} className="h-1" />
                              </div>
                            )}

                            {client.applied && <p className="text-xs text-navy-500 mt-2">Applied {client.applied}</p>}

                            {client.review && (
                              <p className="text-xs text-violet-600 mt-2 font-medium">Review: {client.review}</p>
                            )}

                            {client.completed && (
                              <p className="text-xs text-emerald-600 mt-2 font-medium">Completed {client.completed}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "workflows" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-navy-900">Your Workflows</h2>
              <Link href="/workflow/builder">
                <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                <p className="text-navy-600 mt-2">Loading workflows...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">Error Loading Workflows</h3>
                <p className="text-navy-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : formatWorkflows.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-8 h-8 text-navy-400" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">No Workflows Yet</h3>
                <p className="text-navy-600 mb-6">Create your first workflow to get started</p>
                <Link href="/workflow/builder">
                  <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Workflow
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {formatWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow border-navy-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-navy-900 mb-1">{workflow.name}</h3>
                        <p className="text-sm text-navy-500 mb-1">{workflow.description}</p>
                        <p className="text-sm text-navy-500 font-mono">{workflow.link}</p>
                        <p className="text-xs text-navy-400 mt-1">Created {workflow.created}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={workflow.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}>
                          {workflow.status === 'active' ? 'Published' : 'Draft'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Link href={`/workflow/builder?id=${workflow.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/workflow/${workflow.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center mb-4">
                      <div>
                        <div className="text-2xl font-bold text-navy-900">{workflow.steps}</div>
                        <div className="text-sm text-navy-500">Steps</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-violet-600">{workflow.usage}</div>
                        <div className="text-sm text-navy-500">Usage</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">{workflow.rating.toFixed(1)}</div>
                        <div className="text-sm text-navy-500">Rating</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-navy-700">{workflow.category}</div>
                        <div className="text-sm text-navy-500">Category</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-navy-100">
                          <WorkflowShareModal
                            workflowId={workflow.id}
                            workflowTitle={workflow.name}
                            workflowDescription={workflow.description}
                            username={userProfile?.username}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-navy-600 border-navy-200 bg-transparent"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </WorkflowShareModal>
                      <Link href={`/workflow/${workflow.id}`}>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === "clients" || activeTab === "payments") && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              {activeTab === "clients" ? (
                <Users className="w-8 h-8 text-navy-400" />
              ) : (
                <DollarSign className="w-8 h-8 text-navy-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-navy-900 mb-2">
              {activeTab === "clients" ? "Client Management" : "Payment Dashboard"}
            </h3>
            <p className="text-navy-600 mb-6">
              {activeTab === "clients"
                ? "Detailed client management features coming soon"
                : "Payment tracking and analytics coming soon"}
            </p>
            <Button variant="outline" className="text-navy-600 border-navy-200 bg-transparent">
              Coming Soon
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
