import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function AppointmentForm() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log('Appointment requested:', { date, time, location })
    toast({
      title: "Appointment Requested",
      description: "Your appointment request has been submitted.",
    })
    // Reset form
    setDate('')
    setTime('')
    setLocation('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold text-white">Apply for Blood Donation Appointment</h2>
      
      <div>
        <Label htmlFor="date" className="text-white">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="text-white bg-white/10"
        />
      </div>

      <div>
        <Label htmlFor="time" className="text-white">Time</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="text-white bg-white/10"
        />
      </div>

      <div>
        <Label htmlFor="location" className="text-white">Location</Label>
        <Select onValueChange={setLocation} required>
          <SelectTrigger className="text-white bg-white/10">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital1">Calbayog District Hospital</SelectItem>
            <SelectItem value="hospital2">West Samar Doctors</SelectItem>
            <SelectItem value="redcross">Red Cross Calbayog</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        <Calendar className="w-5 h-5 mr-2" />
        Request Appointment
      </Button>
    </form>
  )
}

