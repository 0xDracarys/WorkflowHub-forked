"use client"

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Workflow, User, Building, DollarSign, ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    isProvider: false,
    businessName: '',
    description: '',
    specialties: [''],
    hourlyRate: 0,
    availability: 'full-time'
  })

  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
      }))
    }
  }, [isLoaded, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          imageUrl: user.imageUrl,
          isProvider: formData.isProvider,
          providerProfile: formData.isProvider ? {
            businessName: formData.businessName,
            description: formData.description,
            specialties: formData.specialties.filter(s => s.trim()),
            hourlyRate: formData.hourlyRate,
            availability: formData.availability,
            portfolio: [],
            rating: 0,
            reviewCount: 0,
            verified: false
          } : undefined
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Profile created successfully!')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Failed to create profile')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }))
  }

  const updateSpecialty = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.map((s, i) => i === index ? value : s)
    }))
  }

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">WorkflowHub</span>
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Welcome to WorkflowHub!</h1>
          <p className="text-navy-600">
            Let's set up your profile to get started
          </p>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-navy-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">First Name</label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Enter your first name"
                      className="bg-white border-navy-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">Last Name</label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Enter your last name"
                      className="bg-white border-navy-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Username</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Choose a username"
                    className="bg-white border-navy-200"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isProvider"
                    checked={formData.isProvider}
                    onChange={(e) => setFormData({...formData, isProvider: e.target.checked})}
                    className="w-4 h-4 text-violet-600 border-navy-300 rounded focus:ring-violet-500"
                  />
                  <label htmlFor="isProvider" className="text-sm font-medium text-navy-700">
                    I want to offer services and create workflows for clients
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  {formData.isProvider ? (
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Next: Provider Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      {loading ? 'Creating Profile...' : 'Create Profile'}
                    </Button>
                  )}
                </div>
              </>
            )}

            {step === 2 && formData.isProvider && (
              <>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Provider Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Business Name</label>
                  <Input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Enter your business name"
                    className="bg-white border-navy-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your services and expertise..."
                    className="bg-white border-navy-200 h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Specialties</label>
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        type="text"
                        value={specialty}
                        onChange={(e) => updateSpecialty(index, e.target.value)}
                        placeholder="Enter a specialty"
                        className="bg-white border-navy-200"
                      />
                      {formData.specialties.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpecialty(index)}
                          className="text-red-600 border-red-200"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecialty}
                    className="text-violet-600 border-violet-200"
                  >
                    Add Specialty
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">Hourly Rate ($)</label>
                    <Input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                      className="bg-white border-navy-200"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">Availability</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="text-navy-600 border-navy-200"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {loading ? 'Creating Profile...' : 'Create Provider Profile'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}
