import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Settings, User, Plus } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-teal-100/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input placeholder="Search projects..." className="pl-10 w-64 bg-slate-50 border-slate-200" />
            </div>

            <Button className="bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
