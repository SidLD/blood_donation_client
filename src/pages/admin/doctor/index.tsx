"use client"

import { useToast } from "@/hooks/use-toast"
import { getHospitalAdmin, updateHospitalAdminStatus } from "@/lib/api"
import type { IAdmin } from "@/types/user"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, XCircle, AlertCircle, User, UserCheck, UserX, ArrowLeft } from "lucide-react"
import type React from "react" // Added import for React

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<IAdmin[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<IAdmin | null>(null)
  const { toast } = useToast()

  const getDoctors = useCallback(async () => {
    try {
      const { data } = (await getHospitalAdmin()) as unknown as { data: IAdmin[] }
      if (data.length) {
        setDoctors(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleUpdateStatus = async (status: "PENDING" | "APPROVED" | "REJECTED") => {
    try {
      if (selectedDoctor) {
        const  data  = (await updateHospitalAdminStatus(selectedDoctor._id as string, { status })) as unknown as any
        if(data.status == 200){
            toast({
                title: "Success",
                description: `Doctor status updated to ${status}`,
              })
              getDoctors() // Refresh the list
              setSelectedDoctor(null) // Close the dialog
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor status. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    getDoctors()
  }, [getDoctors])

  return (
    <Card className="w-full text-white border-red-900 bg-red-950">
             <div className="relative top-4 left-8">
        <a
          href="/admin"
          className="flex items-center text-white hover:opacity-80"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span>Back to Admin</span>
        </a>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Doctor List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-red-800">
              <TableHead className="text-red-200">Username</TableHead>
              <TableHead className="text-red-200">License</TableHead>
              <TableHead className="text-red-200">Hospital</TableHead>
              <TableHead className="text-red-200">Status</TableHead>
              <TableHead className="text-red-200">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id} className="border-b border-red-800/50">
                <TableCell className="font-medium">{doctor.username}</TableCell>
                <TableCell>{doctor.license}</TableCell>
                <TableCell>{doctor.hospital.username}</TableCell>
                <TableCell className="flex justify-start gap-2 mt-1">
                  {doctor.status === "APPROVED" && <CheckCircle className="text-green-500" />}
                  {doctor.status === "REJECT" && <XCircle className="text-red-500" />}
                  {doctor.status === "PENDING" && <AlertCircle className="text-yellow-500" />}
                  <span className="ml-2">{doctor.status}</span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDoctor(doctor)}
                        className="text-red-200 hover:text-white hover:bg-red-800"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="text-white border-red-900 bg-red-950">
                      <DialogHeader>
                        <DialogTitle>Update Doctor Status</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-between mt-4">
                        <Button
                          onClick={() => handleUpdateStatus("APPROVED")}
                          className="bg-green-700 hover:bg-green-600"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleUpdateStatus("REJECTED")} className="bg-red-700 hover:bg-red-600">
                          <UserX className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus("PENDING")}
                          className="bg-yellow-700 hover:bg-yellow-600"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Set Pending
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DoctorList

