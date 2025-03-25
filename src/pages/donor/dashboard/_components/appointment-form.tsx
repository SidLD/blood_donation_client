'use client'

import React, { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { TransactionForm } from '@/types/transaction'
import { getHospitals, createDonorTransaction } from '@/lib/api'
import { DatePicker } from '@/components/ui/datepicker'
import { auth } from '@/lib/services'

export default function AppointmentForm() {
  const [hospitals, setHospitals] = useState<{ _id: string; username: string; address: string }[]>([])
  const [transaction, setTransaction] = useState<Omit<TransactionForm, '_id' | 'donor'>>({
    hospital: '',
    datetime: new Date(),
    status: 'PENDING',
    remarks: ''
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('08:00 AM') // Default time
  const { toast } = useToast()

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      const { data } = (await getHospitals()) as unknown as any
      if (data.length > 0) {
        setHospitals(data)
      } else {
        setHospitals([])
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch hospitals. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!selectedDate) {
        toast({
          title: 'Error',
          description: 'Please select a date and time.',
          variant: 'destructive'
        })
        return
      }

      // Combine selectedDate and selectedTime into a single Date object
      const [time, period] = selectedTime.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      const datetime = new Date(selectedDate)
      datetime.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours)
      datetime.setMinutes(minutes)

      const newTransaction: TransactionForm = {
        ...transaction,
        user: auth.getUserInfo()._id,
        datetime
      }
      await createDonorTransaction(newTransaction)
      toast({
        title: 'Appointment Requested',
        description: 'Your appointment request has been submitted.'
      })
      // Reset form
      setTransaction({
        hospital: '',
        datetime: new Date(),
        status: 'PENDING',
        remarks: ''
      })
      setSelectedDate(undefined)
      setSelectedTime('08:00 AM')
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit appointment request. Please try again.',
        variant: 'destructive'
      })
    }
  }

  // Generate time options every 30 minutes in 12-hour format
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? 'AM' : 'PM'
        const displayHour = hour % 12 || 12
        const time = `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
        options.push(
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        )
      }
    }
    return options
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold text-white">Apply for Blood Donation Appointment</h2>

      <div>
        <Label htmlFor="datetime" className="text-white">
          Date and Time
        </Label>
        <div className="flex items-center gap-4">
          {/* Date Picker */}
          <DatePicker date={selectedDate} setDate={setSelectedDate} />

          {/* Time Selector */}
          <Select  value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeOptions()}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="hospital" className="text-white">
          Hospital
        </Label>
        <Select onValueChange={value => handleSelectChange('hospital', value)} required>
          <SelectTrigger className="text-white bg-white/10">
            <SelectValue placeholder="Select hospital" />
          </SelectTrigger>
          <SelectContent>
            {hospitals.map(hospital => (
              <SelectItem key={hospital._id} value={hospital._id}>
                {hospital.username} - {hospital.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="remarks" className="text-white">
          Remarks
        </Label>
        <Textarea
          id="remarks"
          name="remarks"
          value={transaction.remarks}
          onChange={e => setTransaction({ ...transaction, remarks: e.target.value })}
          className="text-white bg-white/10"
          placeholder="Any additional information..."
        />
      </div>

      <Button type="submit" className="w-full">
        <Calendar className="w-5 h-5 mr-2" />
        Request Appointment
      </Button>
    </form>
  )
}

