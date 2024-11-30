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
import { loginDonor } from '@/lib/api'
import { DonorLoginType } from '@/types/interface'
import { auth } from '@/lib/services'
import { useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  donorId: z.string().min(5, {
    message: "Donor ID must be at least 5 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  })
})

const DonorSignInView: React.FC = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      donorId: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {  
    try {
      const {data} = await loginDonor(values as DonorLoginType) as unknown as any
      if(data.token){
        auth.storeToken(data.token)
        toast({
          title: "Login Success",
          description: "Welcome",
          variant: "default",
        })     
        window.location.href = `/donor`
      }
    
    } catch (error:any) {
      toast({
        title: "Login Failed",
        description: `${error.response.data.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-8 lg:p-12 flex flex-col min-h-full">
        <div className="flex items-center text-white/90">
          <img width={60} src={logo} alt="logo" className="brightness-200" />
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h1 className="mb-8 text-3xl font-bold text-white">
            <span className="px-4 py-2 border-2 border-purple-500 rounded-lg bg-purple-500/10">
              Welcome Back!
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 px-6 py-3 mb-8 bg-white rounded-full">
            <User className="w-6 h-6 text-[#3D0000]" />
            <span className="text-xl font-bold text-[#3D0000]">DONOR</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Name"
                        className="h-14 bg-white border-none rounded-full text-[#3D0000] placeholder:text-[#3D0000]/70 px-6"
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
                        className="h-14 bg-white border-none rounded-full text-[#3D0000] placeholder:text-[#3D0000]/70 px-6"
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
                        type='password'
                        placeholder="Password"
                        className="h-14 bg-white border-none rounded-full text-[#3D0000] placeholder:text-[#3D0000]/70 px-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit"
                className="w-full h-14 text-xl font-bold text-[#3D0000] bg-white hover:bg-white/90 rounded-full mt-8"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      {/* Right side panel - can be removed or modified based on your needs */}
      <div className="hidden lg:flex bg-[#F5F5F5] p-12 flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-[#3D0000]">
          New Here?
        </h2>
        <p className="mb-6 text-[#3D0000]/70">
          Sign up and discover great opportunities
        </p>
        <Button 
          variant="outline"
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-full hover:text-white"
          onClick={() => {
            window.location.href = `${auth.getRole().toLowerCase()}`
          }}
        >
          Register
        </Button>
      </div>
    </div>
  )
}

export default DonorSignInView

