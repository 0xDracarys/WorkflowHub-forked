"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Copy, 
  Share2, 
  ExternalLink, 
  Mail, 
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle
} from "lucide-react"
import { toast } from 'sonner'

interface WorkflowShareModalProps {
  workflowId: string
  workflowTitle: string
  workflowDescription: string
  username?: string
  children?: React.ReactNode
}

export function WorkflowShareModal({ 
  workflowId, 
  workflowTitle, 
  workflowDescription, 
  username,
  children 
}: WorkflowShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://workflowhub.com'
  const shareUrl = username 
    ? `${baseUrl}/${username}/${workflowId}` 
    : `${baseUrl}/workflow/${workflowId}`
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareOptions = [
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Check out this workflow: ${workflowTitle}`)
        const body = encodeURIComponent(
          `I found this helpful workflow on WorkflowHub:\n\n${workflowTitle}\n${workflowDescription}\n\nCheck it out: ${shareUrl}`
        )
        window.open(`mailto:?subject=${subject}&body=${body}`)
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      action: () => {
        const text = encodeURIComponent(
          `Check out this workflow: ${workflowTitle}\n${workflowDescription}\n\n${shareUrl}`
        )
        window.open(`https://wa.me/?text=${text}`)
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const text = encodeURIComponent(
          `Check out this awesome workflow: ${workflowTitle} ${shareUrl} #WorkflowHub #Automation`
        )
        window.open(`https://twitter.com/intent/tweet?text=${text}`)
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const url = encodeURIComponent(shareUrl)
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        const url = encodeURIComponent(shareUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
      }
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="text-violet-600 border-violet-200">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-violet-600" />
            <span>Share Workflow</span>
          </DialogTitle>
          <DialogDescription>
            Share "{workflowTitle}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Link */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-navy-900">Share Link</h4>
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-navy-50 border-navy-200 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="text-violet-600 border-violet-200 hover:bg-violet-50"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-navy-500">
              Anyone with this link can view and use this workflow
            </p>
          </div>

          {/* Social Share Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-navy-900">Share On</h4>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  onClick={option.action}
                  variant="outline"
                  className="justify-start text-navy-700 border-navy-200 hover:bg-navy-50"
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-navy-900">Quick Actions</h4>
            <div className="flex space-x-2">
              <Button
                onClick={() => window.open(shareUrl, '_blank')}
                variant="outline"
                className="flex-1 text-navy-700 border-navy-200 hover:bg-navy-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleCopyLink}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-navy-900">Embed</h4>
            <Card className="p-3 bg-navy-50">
              <code className="text-xs text-navy-600 break-all">
                {`<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
              </code>
            </Card>
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`
                  )
                  toast.success('Embed code copied!')
                } catch (error) {
                  toast.error('Failed to copy embed code')
                }
              }}
              variant="outline"
              size="sm"
              className="w-full text-navy-600 border-navy-200"
            >
              Copy Embed Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
