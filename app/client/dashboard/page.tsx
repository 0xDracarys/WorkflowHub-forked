"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Upload,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Send,
  Paperclip,
  Download,
  Shield,
  Phone,
  Video,
  Calendar,
  AlertCircle,
  CreditCard,
} from "lucide-react"

export default function ClientDashboardPage() {
  const [message, setMessage] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const projectDetails = {
    title: "Example Service Process",
    consultant: "Your Provider",
    startDate: "January 15, 2024",
    expectedCompletion: "March 1, 2024",
    currentStage: "In Progress",
    progress: 65,
    nextMilestone: "Next Step",
    totalInvestment: "$XXX",
    paidAmount: "$XXX",
    nextPayment: "$XXX",
    nextPaymentDue: "TBD",
  }

  const timeline = [
    {
      id: 1,
      title: "Initial Consultation",
      description: "30-minute discovery call completed",
      status: "completed",
      date: "Jan 15, 2024",
      icon: Phone,
      color: "bg-emerald-500",
    },
    {
      id: 2,
      title: "Document Collection",
      description: "All required documents uploaded and verified",
      status: "completed",
      date: "Jan 22, 2024",
      icon: Upload,
      color: "bg-emerald-500",
    },
    {
      id: 3,
      title: "Application Review",
      description: "Your provider is reviewing your submitted materials",
      status: "active",
      date: "In Progress",
      icon: FileText,
      color: "bg-violet-500",
      nextAction: "Waiting for provider feedback and next steps",
    },
    {
      id: 4,
      title: "Interview Preparation",
      description: "Mock interview session and preparation materials",
      status: "pending",
      date: "Upcoming",
      icon: Video,
      color: "bg-navy-400",
    },
    {
      id: 5,
      title: "Final Submission",
      description: "Application submission and tracking",
      status: "pending",
      date: "Pending",
      icon: CheckCircle,
      color: "bg-navy-400",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Your Provider",
      message:
        "Hi! I've reviewed your submission and have some feedback to share. Let's schedule a time to discuss the next steps.",
      time: "2:30 PM",
      isConsultant: true,
      avatar: "/placeholder-avatar.svg",
    },
    {
      id: 2,
      sender: "You",
      message:
        "Thank you for the quick review! I'd love to hear your suggestions. Should we schedule a call to discuss?",
      time: "2:45 PM",
      isConsultant: false,
      avatar: "/client-avatar-1.png",
    },
    {
      id: 3,
      sender: "Your Provider",
      message:
        "I've sent you a calendar link. Also, I'm preparing some resources that will help with your next milestone.",
      time: "3:00 PM",
      isConsultant: true,
      avatar: "/placeholder-avatar.svg",
    },
  ]

  const documents = [
    { name: "Personal Statement - Revised.pdf", size: "245 KB", uploadDate: "Jan 28, 2024", status: "reviewed" },
    { name: "Academic Transcripts.pdf", size: "1.2 MB", uploadDate: "Jan 22, 2024", status: "approved" },
    { name: "Passport Copy.pdf", size: "890 KB", uploadDate: "Jan 22, 2024", status: "approved" },
    { name: "Financial Documents.pdf", size: "2.1 MB", uploadDate: "Jan 22, 2024", status: "approved" },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage("")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-navy-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/placeholder-avatar.svg"
                alt={projectDetails.consultant}
                className="w-12 h-12 rounded-full border-2 border-violet-200 bg-gray-100"
              />
              <div>
                <h1 className="text-xl font-bold text-navy-900">{projectDetails.title}</h1>
                <p className="text-navy-600">with {projectDetails.consultant}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-violet-100 text-violet-700">{projectDetails.currentStage}</Badge>
              <Button variant="outline" size="sm" className="text-navy-600 border-navy-200 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="p-6 border-navy-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-navy-900">Your Progress</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-violet-700">{projectDetails.progress}%</div>
                  <div className="text-sm text-navy-500">Complete</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-600">Current Stage: {projectDetails.currentStage}</span>
                  <span className="text-navy-900 font-medium">Next: {projectDetails.nextMilestone}</span>
                </div>
                <Progress value={projectDetails.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-navy-600">Started:</span>
                  <span className="text-navy-900 font-medium ml-2">{projectDetails.startDate}</span>
                </div>
                <div>
                  <span className="text-navy-600">Expected Completion:</span>
                  <span className="text-navy-900 font-medium ml-2">{projectDetails.expectedCompletion}</span>
                </div>
              </div>
            </Card>

            {/* Next Action Alert */}
            <Card className="p-4 bg-violet-50 border-violet-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-violet-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-violet-800 mb-1">Action Required</h3>
                  <p className="text-violet-700 text-sm">
                    Your provider has reviewed your submission and provided feedback. Please check the messages below and
                    schedule your next call.
                  </p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 border-navy-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-6">Project Timeline</h3>

              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                        step.status === "active"
                          ? "bg-violet-50 border border-violet-200"
                          : step.status === "completed"
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-navy-50 border border-navy-100"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center ${
                          step.status === "active" ? "animate-pulse-glow" : ""
                        }`}
                      >
                        <step.icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4
                            className={`font-semibold ${
                              step.status === "active"
                                ? "text-violet-700"
                                : step.status === "completed"
                                  ? "text-emerald-700"
                                  : "text-navy-500"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-sm text-navy-500">{step.date}</span>
                        </div>
                        <p className="text-navy-600 text-sm">{step.description}</p>

                        {step.status === "active" && step.nextAction && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-violet-200">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-violet-600" />
                              <span className="text-violet-700 font-medium">{step.nextAction}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {index < timeline.length - 1 && (
                      <div className="absolute left-9 top-16 w-0.5 h-4 bg-gradient-to-b from-navy-200 to-violet-200" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Document Management */}
            <Card className="p-6 border-navy-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy-900">Documents</h3>
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-violet-600 border-violet-200 bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="mb-4 p-3 bg-violet-50 rounded-lg border border-violet-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-violet-700">Uploading document...</span>
                    <span className="text-violet-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-navy-500" />
                      <div>
                        <div className="font-medium text-navy-900 text-sm">{doc.name}</div>
                        <div className="text-xs text-navy-500">
                          {doc.size} • {doc.uploadDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          doc.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : doc.status === "reviewed"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-navy-100 text-navy-700"
                        }
                      >
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="p-6 border-navy-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Payment Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-navy-600">Total Investment</span>
                  <span className="font-semibold text-navy-900">{projectDetails.totalInvestment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-600">Paid to Date</span>
                  <span className="font-semibold text-emerald-600">{projectDetails.paidAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-600">Next Payment</span>
                  <span className="font-semibold text-violet-600">{projectDetails.nextPayment}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500">Due Date</span>
                  <span className="text-navy-700">{projectDetails.nextPaymentDue}</span>
                </div>

                <div className="pt-4 border-t border-navy-100">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                </div>

                <div className="pt-4 border-t border-navy-100">
                  <div className="flex items-center space-x-2 text-sm text-navy-600">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Payments are milestone-based and secure</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Communication */}
            <Card className="p-6 border-navy-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Messages</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-emerald-600">Online</span>
                </div>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isConsultant ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-xs ${msg.isConsultant ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          msg.isConsultant
                            ? "bg-white border border-navy-100 text-navy-900"
                            : "bg-gradient-to-r from-violet-600 to-navy-700 text-white"
                        }`}
                      >
                        <div>{msg.message}</div>
                        <div className={`text-xs mt-1 ${msg.isConsultant ? "text-navy-500" : "text-white/70"}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                    <img
                      src={msg.avatar || "/placeholder.svg"}
                      alt={msg.sender}
                      className={`w-8 h-8 rounded-full ${msg.isConsultant ? "order-1 mr-2" : "order-2 ml-2"}`}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-navy-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-navy-500">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-3 h-3" />
                    <span>Attach files</span>
                  </div>
                  <span>Response within 2 hours</span>
                </div>
              </div>
            </Card>

            {/* Consultant Info */}
            <Card className="p-6 border-navy-100">
              <div className="text-center">
                <img
                  src="/placeholder-avatar.svg"
                  alt={projectDetails.consultant}
                  className="w-16 h-16 rounded-full border-2 border-violet-200 mx-auto mb-3 bg-gray-100"
                />
                <h4 className="font-semibold text-navy-900 mb-1">{projectDetails.consultant}</h4>
                <p className="text-navy-600 text-sm mb-3">Service Provider</p>

                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-violet-500 fill-current" />
                  ))}
                  <span className="text-sm text-navy-600 ml-2">4.9 (127 reviews)</span>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-violet-600 border-violet-200 bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-navy-600 border-navy-200 bg-transparent">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
