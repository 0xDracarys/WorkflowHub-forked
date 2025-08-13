import { Button } from "@/components/ui/button"
import { Workflow } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-navy-100/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-700 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
              WorkflowHub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#workflow" className="text-navy-600 hover:text-violet-600 transition-colors font-medium">
              Workflow Builder
            </a>
            <Link href="/features" className="text-navy-600 hover:text-violet-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-navy-600 hover:text-violet-600 transition-colors font-medium">
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-navy-600 hover:text-violet-600 font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
