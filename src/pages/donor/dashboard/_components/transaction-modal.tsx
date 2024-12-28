import { useState } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Clock, CalendarIcon, MapPin, User } from 'lucide-react'
import { Log } from './logs-viewer'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Log
  onUpdate: (id: string, newDateTime: Date) => void
  onDelete: (id: string) => void
}

export function TransactionModal({ isOpen, onClose, transaction, onUpdate, onDelete }: TransactionModalProps) {
  const [newDate, setNewDate] = useState<Date | undefined>(new Date(transaction.datetime))
  const [newTime, setNewTime] = useState(format(new Date(transaction.datetime), 'HH:mm'))

  const handleUpdate = () => {
    if (newDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const updatedDateTime = new Date(newDate)
      updatedDateTime.setHours(hours, minutes)
      onUpdate(transaction._id, updatedDateTime)
      onClose()
    }
  }

  const handleDelete = () => {
    onDelete(transaction._id)
    onClose()
  }

  const isPending = transaction.status === 'PENDING'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <Badge 
              variant={isPending ? "outline" : transaction.status === 'APPROVED' ? "default" : "destructive"}
            >
              {transaction.status}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label className="text-base">Hospital Information</Label>
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span>{transaction.hospital.username}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{transaction.hospital.address}</span>
            </div>
          </div>
          <Separator />
          {isPending ? (
            <div className="space-y-4">
              <Label className="text-base">Update Date and Time</Label>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="date">Date</Label>
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="border rounded-md"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-base">Appointment Date and Time</Label>
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>{format(new Date(transaction.datetime), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{format(new Date(transaction.datetime), 'h:mm a')}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="space-x-2">
          {isPending && (
            <>
              <Button onClick={handleUpdate} className="w-full sm:w-auto">Update</Button>
              <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">Delete</Button>
            </>
          )}
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

