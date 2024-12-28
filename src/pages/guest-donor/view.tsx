'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home } from 'lucide-react'
import logo from '../../assets/logo.png'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { createGuestDonor } from "@/lib/api"

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

const donorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  age: z.string().min(1, "Age is required").regex(/^\d+$/, "Age must be a number"),
  sex: z.any(),
  phone: z.string().regex(/^09\d{9}$/, "Phone number must be in the format 09XXXXXXXXX"),
  email: z.string().email("Invalid email address"),
  bloodType: z.enum(bloodTypes, {
    required_error: "Please select a blood type.",
  }),
  medicalCondition: z.any(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  hospital: z.string().min(1, "Hospital is required"),
})

export type DonorFormData = z.infer<typeof donorSchema>
const GuestDonorView: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
  })

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [, setSelectedHospital] = useState<string>('')

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  const dates = ['4', '5', '8', '10', '23', '27', '28', '30', '31']
  const times = ['8:00 AM', '8:45 AM', '9:20 AM', '1:00 PM']

  const onSubmit = async () => {
    try {
      const {data} = await createGuestDonor(getValues()) as unknown as any
      if(data){
        toast({
          title: "Form submitted successfully",
          description: "We've received your donor application.",
        })
        handleNext()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your form.",
        variant: "destructive",
      })
    }
  }

  const handleNext = () => {
    setStep(prev => (prev + 1) as 1 | 2 | 3)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setValue('date', `${currentMonth} ${date}, ${currentYear}`)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setValue('time', time)
  }

  const handleHospitalSelect = (hospital: string) => {
    setSelectedHospital(hospital)
    setValue('hospital', hospital)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="h-full py-4 space-y-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="text-black bg-white"
                placeholder="Enter your full name"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="text-black bg-white"
                placeholder="Enter your address"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  className="text-black bg-white"
                  placeholder="Age"
                  {...register("age")}
                />
                {errors.age && <p className="text-red-500">{errors.age.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="F"
                      className="w-4 h-4 text-black"
                      {...register("sex")}
                    />
                    <span>F</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="M"
                      className="w-4 h-4 text-black"
                      {...register("sex")}
                    />
                    <span>M</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Cellphone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="text-black bg-white"
                placeholder="Enter your cellphone number"
                {...register("phone")}
              />
              {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="text-black bg-white"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select onValueChange={(value) => setValue('bloodType', value as any)}>
                <SelectTrigger id="bloodType" className="w-full text-black bg-white">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodType && <p className="text-red-500">{errors.bloodType.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Do you have any medical condition?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Yes"
                    className="w-4 h-4 text-black"
                    {...register("medicalCondition")}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="No"
                    className="w-4 h-4"
                    {...register("medicalCondition")}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <Button onClick={() => {handleNext()}} className="w-full  bg-white text-[#591C1C] hover:bg-white/90">
              Next
            </Button>
          </div>
        )

      case 2:
        return (
          <div className="w-full h-full py-10 space-y-6">
            <div className="grid grid-cols-9 gap-2">
              {dates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "secondary" : "outline"}
                  className={`rounded-full p-2 aspect-square ${
                    selectedDate === date ? 'bg-white' : 'bg-[#eddede] text-[#f06464]'
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  {date}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 mx-10">
              {times.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "secondary" : "outline"}
                  className={`rounded-full ${
                    selectedTime === time ? 'bg-white text-[#591C1C]' : 'bg-[#eddede] text-[#f06464]'
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Choose a credited Hospital</Label>
              <Select onValueChange={handleHospitalSelect}>
                <SelectTrigger className="w-full bg-white text-[#591C1C]">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calbayog">Calbayog District Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              onClick={() => {
                onSubmit()
              }}
              className="w-full bg-white text-[#591C1C] hover:bg-white/90"
            >
              Confirm
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="p-10 space-y-6 text-center">
            <h2 className="text-3xl font-bold">Thank you!</h2>
            <p className="text-white/90">
              Please view your email/messages for the reminders before your scheduled screening. 
              You may register in the website after receiving your Donor ID.
            </p>
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full">
                <Home className="w-12 h-12 text-[#591C1C]" />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid w-full h-full md:grid-cols-3 ">
      <div className="col-span-2 bg-[#3D0000]  text-white ">
        <form className="max-w-md mx-auto space-y-2"  onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center gap-2">
            <img className="relative float-left" width={60} src={logo} alt="logo" />
            <h2 className="text-lg font-semibold uppercase">Donor Applicant</h2>
          </div>
          <p className="text-lg font-bold text-center text-white/80">
            {step === 1 ? "Let's schedule your screening!" : 
             step === 2 ? "Choose Date & Time" : ""}
          </p>
          {renderStep()}
        </form>
      </div>
      <div className=" bg-[#F8EFEF] p-6 flex flex-col items-center justify-center gap-4">
        <h2 className="text-[#591C1C] text-2xl">Welcome Back!</h2>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/login'
          }}
          className="border-[#591C1C] text-[#591C1C] hover:bg-[#591C1C] hover:text-white"
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default GuestDonorView

