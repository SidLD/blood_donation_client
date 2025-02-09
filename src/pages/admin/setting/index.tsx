"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Toaster, toast } from "react-hot-toast"
import { getHospitalDetail, updateHospital, updateHospitalPassowrd } from "@/lib/api"
import { auth } from "@/lib/services"

// Define the schema for hospital details
const hospitalSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  license: z.string().min(1, "License number is required"),
})

// Define the schema for password update
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type HospitalFormData = z.infer<typeof hospitalSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

const AdminSetting: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const {
    register: registerHospital,
    handleSubmit: handleSubmitHospital,
    setValue: setHospitalValue,
    formState: { errors: hospitalErrors },
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const {data} = await getHospitalDetail(auth.getUserInfo().id) as unknown as any
        if(data){
          setHospitalValue("hospitalName", data.username)
          setHospitalValue("license", data.license)
        }
      } catch (error) {
        console.error("Error fetching hospital details:", error)
        toast.error("Failed to load hospital details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHospitalDetails()
  }, [setHospitalValue])

  const onSubmitHospital = async (res: HospitalFormData) => {
    try {
      const response = await updateHospital(auth.getUserInfo().id, {...res}) as unknown as any

      if (response.status == 200) {
        throw new Error("Failed to update hospital details")
      }

      toast.success("Hospital details updated successfully")
    } catch (error) {
      console.error("Error updating hospital details:", error)
      toast.error("Failed to update hospital details")
    }
  }

  const onSubmitPassword = async (res: PasswordFormData) => {
    try {
      const data = await updateHospitalPassowrd(auth.getUserInfo().id,{
        currentPassword: res.currentPassword,
        newPassword: res.newPassword,
      })as unknown as any
      console.log(data)
      if (data.status != 200) {
        throw new Error("Failed to update password")
      }

      toast.success("Password updated successfully")
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Failed to update password")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-screen bg-[#F8EFEF] p-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/admin")} className="mb-6 flex items-center text-[#4A1515] hover:text-red-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-[#4A1515] mb-8">Update Hospital Information</h1>

        {/* Hospital Details Form */}
        <form onSubmit={handleSubmitHospital(onSubmitHospital)} className="mb-12 space-y-6">
          <h2 className="text-2xl font-bold text-[#4A1515] mb-4">Hospital Details</h2>
          <div>
            <label htmlFor="hospitalName" className="block text-sm font-medium text-[#4A1515]">
              Hospital Name
            </label>
            <input
              {...registerHospital("hospitalName")}
              className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {hospitalErrors.hospitalName && (
              <p className="mt-1 text-sm text-red-600">{hospitalErrors.hospitalName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="license" className="block text-sm font-medium text-[#4A1515]">
              License
            </label>
            <input
              {...registerHospital("license")}
              className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {hospitalErrors.license && <p className="mt-1 text-sm text-red-600">{hospitalErrors.license.message}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Update Hospital Information
            </button>
          </div>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
          <h2 className="text-2xl font-bold text-[#4A1515] mb-4">Change Password</h2>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-[#4A1515]">
              Current Password
            </label>
            <input
              type="password"
              {...registerPassword("currentPassword")}
              className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#4A1515]">
              New Password
            </label>
            <input
              type="password"
              {...registerPassword("newPassword")}
              className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4A1515]">
              Confirm New Password
            </label>
            <input
              type="password"
              {...registerPassword("confirmPassword")}
              className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSetting

