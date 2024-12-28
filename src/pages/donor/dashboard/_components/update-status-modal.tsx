import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

interface UpdateStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (status: 'APPROVED' | 'REJECTED', comments: string) => void
  currentStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export function UpdateStatusModal({ isOpen, onClose, onUpdate, currentStatus }: UpdateStatusModalProps) {
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>(currentStatus === 'PENDING' ? 'APPROVED' : currentStatus)
  const [comments, setComments] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(status, comments)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <RadioGroup value={status} onValueChange={(value: 'APPROVED' | 'REJECTED') => setStatus(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="APPROVED" id="approved" />
                <Label htmlFor="approved">Approve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="REJECTED" id="rejected" />
                <Label htmlFor="rejected">Reject</Label>
              </div>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any additional comments..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

