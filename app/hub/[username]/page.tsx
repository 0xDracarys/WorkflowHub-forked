import { notFound } from 'next/navigation'
import { UserAPI } from '@/lib/user-api'
import { WorkflowAPI } from '@/lib/workflow-api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Workflow } from '@/lib/models'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, DollarSign, ExternalLink, WorkflowIcon } from 'lucide-react'

interface HubPageProps {
  params: { username: string }
}

export default async function HubPage({ params }: HubPageProps) {
  const { username } = await params // Ensure params is awaited
  console.log("Resolved username for HubPage:", username);

  const userResult = await UserAPI.getUserByUsername(username)

  if (!userResult.success || !userResult.data) {
    notFound()
  }

  const user = userResult.data

  const workflowsResult = await WorkflowAPI.getWorkflowsByUserId(user._id!.toHexString(), true)

  const publicWorkflows = workflowsResult.success ? workflowsResult.data : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <header className="bg-white/80 backdrop-blur-md border-b border-navy-100/50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-violet-500 shadow-lg">
            <Image 
              src={user.profileImageUrl || "/placeholder-avatar.svg"} 
              alt={user.firstName || "User"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-900">{user.firstName} {user.lastName}</h1>
            <p className="text-violet-700 text-lg font-medium">@{user.username}</p>
            {user.providerProfile?.bio && (
              <p className="text-navy-600 mt-2">{user.providerProfile.bio}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-6">My Public Workflows</h2>
        
        {publicWorkflows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-navy-100">
            <WorkflowIcon className="w-16 h-16 text-navy-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-navy-900 mb-2">No Public Workflows Yet</h3>
            <p className="text-navy-600">This user has not published any workflows.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicWorkflows.map((workflow: Workflow) => (
              <Card key={workflow._id!.toHexString()} className="p-6 hover:shadow-lg transition-shadow border-navy-100 flex flex-col">
                <h3 className="font-semibold text-navy-900 text-lg mb-2">{workflow.title}</h3>
                <p className="text-sm text-navy-600 mb-4 flex-grow">{workflow.description}</p>
                
                <div className="flex items-center text-sm text-navy-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{workflow.steps?.length || 0} Steps</span>
                </div>
                
                {workflow.category && (
                  <div className="flex items-center text-sm text-navy-500 mb-4">
                    <WorkflowIcon className="w-4 h-4 mr-2" />
                    <span>Category: {workflow.category}</span>
                  </div>
                )}

                <Link href={`/workflow/${workflow._id!.toHexString()}`} className="mt-auto">
                  <Button variant="outline" className="w-full text-violet-600 border-violet-200 hover:bg-violet-50">
                    View Workflow <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
