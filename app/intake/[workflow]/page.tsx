"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, CheckCircle, FileText, User, Shield, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function IntakeFormPage({ params }: { params: { workflow: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",

    // Service Selection
    selectedService: "",

    // Project Details
    timeline: "",
    budget: "",
    experience: "",
    goals: "",
    challenges: "",

    // Specific Questions (varies by workflow)
    visaType: "",
    currentStatus: "",
    urgency: "",

    // Agreement
    termsAccepted: false,
    communicationPreference: "email",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const workflowTitles = {
    visa: "UK Student Visa Process",
    strategy: "Business Strategy Intensive",
    consult: "Quick Consultation Call",
  }

  const workflowTitle = workflowTitles[params.workflow as keyof typeof workflowTitles] || "Service Application"

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.selectedService) {
        newErrors.selectedService = "Please select a service"
      }
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
    }

    if (step === 4) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = "You must accept the terms to continue"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to client dashboard
      router.push("/client/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate file upload
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            setUploadedFiles([...uploadedFiles, ...Array.from(files).map((f) => f.name)])
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const services = [
    {
      id: "visa",
      title: "UK Student Visa Process",
      price: "$1,200",
      duration: "4-6 weeks",
      description: "Complete visa application support",
      popular: true,
    },
    {
      id: "strategy",
      title: "Business Strategy Intensive",
      price: "$2,500",
      duration: "12 weeks",
      description: "90-day business transformation",
      popular: false,
    },
    {
      id: "consult",
      title: "Quick Consultation Call",
      price: "$100",
      duration: "30 minutes",
      description: "Expert advice session",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
            <Link
              href="/hub/template"
              className="inline-flex items-center space-x-2 text-navy-600 hover:text-violet-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Provider Hub</span>
            </Link>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <img
              src="/placeholder-avatar.svg"
              alt="Service Provider"
              className="w-12 h-12 rounded-full border-2 border-violet-200 bg-gray-100"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-navy-900">Start Your Journey</h1>
              <p className="text-navy-600">with Your Provider</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-navy-500 text-sm">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        <Card className="p-8 border-navy-100 shadow-lg">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-navy-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Choose Your Service</h2>
                <p className="text-navy-600">Select the service that best fits your needs</p>
              </div>

              <div className="space-y-4">
                <RadioGroup
                  value={formData.selectedService}
                  onValueChange={(value) => {
                    setFormData({ ...formData, selectedService: value })
                    if (errors.selectedService) setErrors({ ...errors, selectedService: "" })
                  }}
                >
                  {services.map((service) => (
                    <div key={service.id} className="relative">
                      <div
                        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                          formData.selectedService === service.id
                            ? "border-violet-400 bg-violet-50"
                            : "border-navy-200 hover:border-violet-300 hover:bg-navy-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={service.id} id={service.id} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor={service.id} className="font-semibold text-navy-900 cursor-pointer">
                                {service.title}
                              </Label>
                              {service.popular && (
                                <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-navy-600 text-sm mb-2">{service.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-navy-500">
                              <span className="font-semibold text-emerald-600">{service.price}</span>
                              <span>•</span>
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {errors.selectedService && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.selectedService}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-navy-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Let's get to know you</h2>
                <p className="text-navy-600">Tell us about yourself so we can provide the best possible service</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-navy-700 font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter your full name"
                    className={`mt-2 ${errors.fullName ? "border-red-400" : ""}`}
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value })
                      if (errors.fullName) setErrors({ ...errors, fullName: "" })
                    }}
                  />
                  {errors.fullName && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-navy-700 font-medium">Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className={`mt-2 ${errors.email ? "border-red-400" : ""}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-navy-700 font-medium">Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="mt-2"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="text-navy-700 font-medium">Preferred Communication Method</Label>
                  <RadioGroup
                    value={formData.communicationPreference}
                    onValueChange={(value) => setFormData({ ...formData, communicationPreference: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-navy-700 font-medium">What are your main goals? *</Label>
                  <Textarea
                    placeholder="Describe what you're hoping to achieve..."
                    className="mt-2 min-h-[100px]"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Upload Documents</h2>
                <p className="text-navy-600">Upload any relevant documents to help us get started</p>
              </div>

              <div className="space-y-6">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-navy-300 rounded-lg p-8 text-center hover:border-violet-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-navy-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">Drop files here or click to upload</h3>
                    <p className="text-navy-600 text-sm">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                  </label>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-violet-700">Uploading documents...</span>
                      <span className="text-violet-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-navy-900">Uploaded Files:</h4>
                    {uploadedFiles.map((fileName, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                      >
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-800 font-medium">{fileName}</span>
                        <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-navy-50 rounded-lg border border-navy-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-navy-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-navy-800 mb-1">Secure Upload</h4>
                      <p className="text-navy-700 text-sm">
                        Your documents are encrypted and stored securely. Only you and your provider will have access to them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Ready to get started?</h2>
                <p className="text-navy-600">Review your information and confirm to begin your journey</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-navy-50 rounded-lg">
                  <h4 className="font-semibold text-navy-900 mb-3">Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-navy-600">Service:</span>
                      <span className="text-navy-900 font-medium">
                        {services.find((s) => s.id === formData.selectedService)?.title || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-600">Applicant:</span>
                      <span className="text-navy-900 font-medium">{formData.fullName || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-600">Email:</span>
                      <span className="text-navy-900 font-medium">{formData.email || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-600">Documents:</span>
                      <span className="text-navy-900 font-medium">{uploadedFiles.length} uploaded</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-600">Investment:</span>
                      <span className="text-emerald-600 font-bold">
                        {services.find((s) => s.id === formData.selectedService)?.price || "TBD"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, termsAccepted: checked as boolean })
                        if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: "" })
                      }}
                    />
                    <Label htmlFor="terms" className="text-sm text-navy-700 leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-violet-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-violet-600 hover:underline">
                        Privacy Policy
                      </a>
                      . I understand that payment will be processed securely and held in escrow until milestones are
                      completed.
                    </Label>
                  </div>
                  {errors.termsAccepted && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.termsAccepted}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <h4 className="font-semibold text-violet-800 mb-2">What happens next?</h4>
                  <ol className="text-violet-700 text-sm space-y-1">
                    <li>1. Your provider will review your application within 24 hours</li>
                    <li>2. You'll receive a welcome email with next steps</li>
                    <li>3. Your first milestone will be scheduled</li>
                    <li>4. You'll get access to your personal project dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-navy-100">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-navy-200 text-navy-600 hover:bg-navy-50 bg-transparent disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentStep === 4 && !formData.termsAccepted}
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white disabled:opacity-50"
            >
              {currentStep === totalSteps ? "Submit Application" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
