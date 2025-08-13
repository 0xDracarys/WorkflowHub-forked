import { getActiveWorkflowsForUser } from "@/lib/workflow-api"
import DashboardClientPage from "./dashboard-client-page"
import type { WorkflowWithConsultant } from "@/lib/workflow-api"

// This is now a server component
export default async function UserDashboardPage() {
  const user = {
    id: "user_client_1", // A mock user ID for fetching data
    name: "Alex Thompson",
    avatar: "/client-avatar-1.png",
  }

  // Fetch data on the server
  const activeWorkflows: WorkflowWithConsultant[] = await getActiveWorkflowsForUser(user.id)

  // Pass data to the client component for rendering
  return <DashboardClientPage user={user} activeWorkflows={activeWorkflows} />
}
