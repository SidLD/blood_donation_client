import { Calendar, ClipboardList, LogOut, CalendarPlus, Building2, Pencil, Trash } from "lucide-react"
import bloodicon from "../../../assets/logo.png"
import { Button } from "@/components/ui/button"
import logo from "../../../assets/logo.png"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/services"
import { useEffect, useState } from "react"
import { createHospital, getHospitals, updateHospital } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface Hospital {
  _id: string
  username: string
  license: string
  address: string
  contact: string
}

const formSchema = z.object({
  _id: z.string().optional(),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  license: z.string().min(2, {
    message: "License must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  contact: z.string().min(6, {
    message: "Contact must be at least 6 characters.",
  }),
})

export default function AdminDashboard() {
  const { toast } = useToast()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      license: "",
      address: "",
      contact: "",
    },
  })

  const handleLogout = () => {
    try {
      auth.clear()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error) {}
  }

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingHospital) {
        // Update hospital
        const {data} = await updateHospital(values._id as string,values) as unknown as any
        console.log(data);
        toast({
          title: "Success",
          description: "Hospital updated successfully",
        })
      } else {
        // Create hospital
        const {data} = await createHospital(values) as unknown as any
        console.log(data);
        toast({
          title: "Success",
          description: "Hospital created successfully",
        })
      }
      form.reset()
      setIsOpen(false)
      setEditingHospital(null)
      fetchHospitals()
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital)
    form.reset({
      _id: hospital._id,
      username: hospital.username,
      license: hospital.license,
      address: hospital.address,
      contact: hospital.contact
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hospital?")) {
      try {
        await fetch(`/api/hospitals/${id}`, {
          method: "DELETE",
        })
        toast({
          title: "Success",
          description: "Hospital deleted successfully",
        })
        fetchHospitals()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete hospital",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="bg-[#3D0000] p-8 lg:p-12 flex flex-col min-h-[600px] relative">
      <div className="flex items-center justify-between text-white/90">
        <div className="flex justify-center ">
        <img
          width={80}
          src={logo || "/placeholder.svg"}
          alt="logo"
          className="relative brightness-200 top-[-20px] left-[-20px]"
        />
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-8 text-white bg-transparent border-white/20 hover:bg-white/10">
                <Building2 className="w-4 h-4 mr-2" />
                View Hospitals
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-red-950 text-white border-red-900">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingHospital ? "Edit Hospital" : "Hospitals"}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-white placeholder-red-300 border-red-800 bg-red-900/50" />
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
                          <FormLabel>License</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-white placeholder-red-300 border-red-800 bg-red-900/50" />
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
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-white placeholder-red-300 border-red-800 bg-red-900/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact</FormLabel>
                          <FormControl>
                            <Input {...field} className="text-white placeholder-red-300 border-red-800 bg-red-900/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-red-700 hover:bg-red-600">
                      {editingHospital ? "Update Hospital" : "Add Hospital"}
                    </Button>
                  </form>
                </Form>
              </div>
              <div className="mt-6 max-h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-red-800">
                      <TableHead className="text-red-200">Username</TableHead>
                      <TableHead className="text-red-200">License</TableHead>
                      <TableHead className="text-red-200">Address</TableHead>
                      <TableHead className="text-red-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitals.map((hospital) => (
                      <TableRow key={hospital._id} className="border-b border-red-800/50">
                        <TableCell className="font-medium">{hospital.username}</TableCell>
                        <TableCell>{hospital.license}</TableCell>
                        <TableCell>{hospital.address}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(hospital)}
                              className="text-red-200 hover:text-white hover:bg-red-800"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(hospital._id)}
                              className="text-red-200 hover:text-white hover:bg-red-800"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button variant="ghost" className="absolute text-white top-4 right-4 hover:bg-white/10" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
      <header className="flex items-center p-4">
        <h1 className="pr-8 mx-auto text-2xl font-bold text-white">ADMIN DASHBOARD</h1>
      </header>

      <main className="container px-4 py-12 mx-auto">
        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/calendar"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <Calendar className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Calendar</span>
          </a>

          <a
            href="/admin/donor-list"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <ClipboardList className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Donor List</span>
          </a>

          <a
            href="/admin/blood-supply"
            className="flex flex-col items-center p-4 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <img src={bloodicon || "/placeholder.svg"} className="relative mb-4 w-28 h-28" />
            <span className="w-full text-xl font-semibold text-center">Transactions</span>
          </a>

          <a
            href="/admin/events"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <CalendarPlus className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold text-center">Events Management</span>
          </a>
        </div>
      </main>
    </div>
  )
}

