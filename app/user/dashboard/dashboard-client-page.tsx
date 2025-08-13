"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Bell,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import type { WorkflowWithConsultant } from "@/lib/workflow-api"

interface DashboardClientPageProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  activeWorkflows: WorkflowWithConsultant[];
}

export default function DashboardClientPage({ user, activeWorkflows }: DashboardClientPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-navy-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-navy-700 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
                  My Dashboard
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Link href="/user/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-navy-800">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
          <p className="text-navy-600">You have {activeWorkflows.length} active workflows. Let&apos;s keep the momentum going!</p>
        </div>

        {/* Active Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeWorkflows.length > 0 ? (
            activeWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="p-6 hover:shadow-xl transition-all duration-300 border-navy-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={workflow.consultant.avatarUrl || "/placeholder-user.jpg"}
                      alt={workflow.consultant.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-navy-900 group-hover:text-violet-700">{workflow.name}</h3>
                      <p className="text-sm text-navy-500">with {workflow.consultant.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      {/* Placeholder data for progress */}
                      <span className="text-navy-600">Document Review</span>
                      <span className="text-navy-900 font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-navy-50 rounded-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-navy-500" />
                    </div>
                    <div>
                      {/* Placeholder data for last update */}
                      <p className="text-sm font-medium text-navy-800">Sarah sent a message</p>
                      <p className="text-xs text-navy-500">3h ago</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/client/dashboard">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-navy-700">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
              <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-8 h-8 text-navy-400" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">No active workflows yet</h3>
              <p className="text-navy-600 mb-6">
                When you enroll in a workflow, it will appear here.
              </p>
              <Button variant="outline" className="text-violet-600 border-violet-200 bg-transparent">
                Browse Workflows
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
