"use client"

import { SignIn, SignUp } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Workflow, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signup') {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-violet-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WorkflowHub</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Join WorkflowHub"}</h1>
          <p className="text-navy-300">
            {isLogin ? "Sign in to your workflow dashboard" : "Start building your professional workflow"}
          </p>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="mb-6 flex justify-center space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-violet-100 text-violet-700"
                  : "text-navy-300 hover:text-white hover:bg-navy-50/10"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-violet-100 text-violet-700"
                  : "text-navy-300 hover:text-white hover:bg-navy-50/10"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="flex justify-center">
            {isLogin ? (
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-violet-600 hover:bg-violet-700',
                    card: 'bg-transparent shadow-none',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-navy-300',
                    socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                    formFieldInput: 'bg-white/10 border-white/20 text-white',
                    formFieldLabel: 'text-white',
                    footerActionLink: 'text-violet-300 hover:text-white',
                    dividerLine: 'bg-white/20',
                    dividerText: 'text-navy-300',
                  }
                }}
                redirectUrl="/dashboard"
                signUpUrl="/auth?mode=signup"
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-violet-600 hover:bg-violet-700',
                    card: 'bg-transparent shadow-none',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-navy-300',
                    socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                    formFieldInput: 'bg-white/10 border-white/20 text-white',
                    formFieldLabel: 'text-white',
                    footerActionLink: 'text-violet-300 hover:text-white',
                    dividerLine: 'bg-white/20',
                    dividerText: 'text-navy-300',
                  }
                }}
                redirectUrl="/onboarding"
                signInUrl="/auth?mode=signin"
              />
            )}
          </div>
        </Card>

        <div className="mt-8 text-center text-navy-300 text-sm">
          By continuing, you agree to our{" "}
          <a href="#" className="text-violet-300 hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-violet-300 hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
