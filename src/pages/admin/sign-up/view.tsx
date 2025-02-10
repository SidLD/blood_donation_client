"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import logo from "../../../assets/logo.png"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { getHospitals, registerAdmin } from "@/lib/api"

const adminSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  license: z.string().min(5, {
    message: "License must be at least 5 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  hospitalId: z.string().min(1, {
    message: "Please select a hospital.",
  }),
})

const AdminSignUpView: React.FC = () => {
  const router = useNavigate()
  const { toast } = useToast()
  const [hospitals, setHospitals] = useState<{ _id: string; username: string; address: string }[]>([])

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
      console.error("Error fetching hospitals:", error)
      toast({
        title: "Error",
        description: "Failed to fetch hospitals. Please try again.",
        variant: "destructive",
      })
    }
  }

  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: "",
      license: "",
      address: "",
      password: "",
      hospitalId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof adminSchema>) => {
    try {
      await registerAdmin(values as any) as unknown as any
      toast({
        title: "Registration Successful",
        description: "You will be redirected to the login shortly.",
      })
      setTimeout(() => {
        router("/admin")
      }, 1000)
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Registration Failed",
        description: err.message || "An error occurred during registration.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-4 lg:p-6 flex flex-col lg:min-h-[25rem]">
        <div className="z-20 flex items-center text-white/90">
          <img width={60} src={logo || "/placeholder.svg"} alt="logo" />
        </div>

        <div className="flex justify-center w-full">
          <div className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-lg w-fit bg-white/90">
            <User className="w-5 h-5 text-[#3D0000]" />
            <span className="font-bold text-[#3D0000]">ADMIN</span>
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
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="License"
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
            <FormField
              control={form.control}
              name="hospitalId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70">
                        <SelectValue placeholder="Select Hospital" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hospitals.map((hospital) => (
                        <SelectItem key={hospital._id} value={hospital._id}>
                          {hospital.username}
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
              {form.formState.isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="bg-[#F5F5F5] p-8 lg:p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#3D0000] mb-2">Welcome Back!</h1>
        <p className="text-[#3D0000]/70 mb-6">Log in to access important details.</p>
        <Button
          variant="outline"
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-3xl hover:text-white"
          onClick={() => router("/login")}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default AdminSignUpView

