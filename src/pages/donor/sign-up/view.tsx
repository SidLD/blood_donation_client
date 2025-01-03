'use client'

import React, { useState } from 'react'
import { User, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import logo from '../../../assets/logo.png'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { registerDonor } from '@/lib/api'
import { type DonorType } from '@/types/interface'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const
const genders = ['Male', 'Female', 'Other'] as const

const donorSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  cellphoneNumber: z.string().regex(/^[0-9]+$/, {
    message: "Please enter a valid cellphone number.",
  }),
  donorId: z.string().min(5, {
    message: "Donor ID must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  age: z.number().min(18, {
    message: "You must be at least 18 years old to register.",
  }).max(65, {
    message: "You must be 65 years old or younger to register.",
  }),
  gender: z.enum(genders, {
    required_error: "Please select a gender.",
  }),
  bloodType: z.enum(bloodTypes, {
    required_error: "Please select a blood type.",
  }),
})

const DonorSignUpView: React.FC = () => {
  const router = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof donorSchema>>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      username: "",
      email: "",
      address: "",
      cellphoneNumber: "",
      donorId: "",
      password: "",
      age: undefined,
      gender: undefined,
      bloodType: undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof donorSchema>) => {
    try {
      await registerDonor(values as unknown as DonorType)
      toast({
        title: "Registration Successful",
        description: "You will be redirected to the login shortly.",
      })
      setTimeout(() => {
        router('/donor')
      }, 1000)
    } catch (err: any) {
      console.log(err)
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-4 lg:p-6 flex flex-col lg:min-h-[25rem]">
        <div className="z-20 flex items-center text-white/90">
          <img width={60} src={logo} alt="logo" />
        </div>
        
        <div className='flex justify-center w-full'>
          <div className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-lg w-fit bg-white/90">
            <User className="w-5 h-5 text-[#3D0000]" />
            <span className="font-bold text-[#3D0000]">DONOR</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 px-12 space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Username"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Email"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Address"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cellphoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Cellphone Number"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="donorId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Donor ID"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#3D0000]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Age"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70">
                        <SelectValue placeholder="Select Blood Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full bg-white hover:bg-white/90 text-[#3D0000] font-bold h-12 text-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="bg-[#F5F5F5] p-8 lg:p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#3D0000] mb-2">
          Welcome Back!
        </h1>
        <p className="text-[#3D0000]/70 mb-6">
          Log in to access important details.
        </p>
        <Button 
          variant="outline"
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-3xl hover:text-white"
          onClick={() => router('/login')}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default DonorSignUpView

