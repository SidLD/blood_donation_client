'use client'

import React from 'react'
import { User } from 'lucide-react'
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
import logo from '../../../assets/logo.png'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { registerDonor } from '@/lib/api'
import { type DonorType } from '@/types/interface'

const donorSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
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
})

const DonorSignUpView: React.FC = () => {
  const router = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof donorSchema>>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      username: "",
      address: "",
      cellphoneNumber: "",
      donorId: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof donorSchema>) => {
    // Simulating an API call
    await registerDonor(values as unknown as DonorType)
    .then(() => {
      toast({
        title: "Registration Successful",
        description: "You will be redirected to the login shortly.",
      })
      setTimeout(() => {
        router('/donor')
      }, 1000)
    })
    .catch((err:any) => {
      console.log(err)
    })
  }

  return (
    <div className="grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-4 lg:p-6 flex flex-col lg:min-h-[25rem]">
        <div className="z-20 flex items-center  text-white/90">
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
                    <Input 
                      type="password"
                      placeholder="Password"
                      className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
                      {...field}
                    />
                  </FormControl>
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

