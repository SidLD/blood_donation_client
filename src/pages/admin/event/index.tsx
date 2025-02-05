import type React from "react"
import { useState, useEffect } from "react"
import { ref, deleteObject, getDownloadURL } from "firebase/storage"
import { ArrowLeft, Eye, Pencil, Trash } from "lucide-react"
import { Storage } from "@/lib/firebase"
import { uploadImage } from "@/lib/upload"
import { useNavigate } from "react-router-dom"
import type { EventType } from "@/types/interface"
import { createEvent, getEvents, updateEvent, deleteEvent, getHospitals } from "@/lib/api"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { z } from "zod"
import { format, toZonedTime } from "date-fns-tz"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const eventSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }).min(2),
  startDate: z.string({ required_error: "Start Date is required" }),
  endDate: z.string({ required_error: "End Date is required" }),
  location: z.string({ required_error: "Location is required" }),
  post: z.boolean().default(false),
  imgUrl: z.any(),
  hospital: z.string()
})

type EventFormData = z.infer<typeof eventSchema>

const EventsPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null)
  const [events, setEvents] = useState<EventType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const { control, handleSubmit, reset, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })
  const [hospitals, setHospitals] = useState<{ _id: string; username: string; address: string }[]>([])

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
  useEffect(() => {
    fetchHospitals()
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data } = (await getEvents()) as unknown as any
      if (data.length > 0) {
        const updatedEvents = await Promise.all(
          data.map(async (temp: EventType) => {
            let tempImg = null
            try {
              tempImg = await getDownloadURL(ref(Storage, temp.imgUrl))
            } catch (error) {
              tempImg = null
            }
            return {
              ...temp,
              imgUrl: tempImg,
            }
          }),
        )
        setEvents(updatedEvents)
      } else {
        setEvents([])
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const onSubmit = async (data: EventFormData) => {
    let imageUrl = null

    if (!image && !isUpdating) {
      toast({
        title: "Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (image) {
        const uploadedImageRef = (await uploadImage(image, `${data.title}-${new Date()}`)) as string
        imageUrl = await getDownloadURL(ref(Storage, uploadedImageRef))
      }

      const eventData: any = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        imgUrl: imageUrl || selectedEvent?.imgUrl || "",
      }

      if (isUpdating && selectedEvent) {
        await updateEvent(selectedEvent._id!, eventData)
      } else {
        await createEvent(eventData)
      }

      resetForm()
      await fetchEvents()

      toast({
        title: "Success",
        description: `Event ${isUpdating ? "updated" : "created"} successfully!`,
      })
      setShowModal(false)
    } catch (err) {
      console.error(`Error ${isUpdating ? "updating" : "creating"} event:`, err)
      toast({
        title: "Error",
        description: `An error occurred while ${isUpdating ? "updating" : "creating"} the event.`,
        variant: "destructive",
      })

      if (imageUrl) {
        const fileRef = ref(Storage, imageUrl)
        await deleteObject(fileRef)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewEvent = (event: EventType) => {
    reset()
    setSelectedEvent(event)
    setValue("title", event.title)
    if(event.hospital?._id){
      setValue("hospital", event.hospital._id as string )
    }
    setValue("description", event.description)
    setValue("startDate", format(toZonedTime(new Date(event.startDate), "Asia/Manila"), "yyyy-MM-dd'T'HH:mm"))
    setValue("endDate", format(toZonedTime(new Date(event.endDate), "Asia/Manila"), "yyyy-MM-dd'T'HH:mm"))
    setValue("location", event.location)
    setValue("post", event.post)
    setShowModal(true)
    setIsUpdating(false)
  }

  const handleUpdateEvent = (event: EventType) => {
    reset()
    setSelectedEvent(event)
    setValue("title", event.title)
    if(event.hospital?._id){
      setValue("hospital", event.hospital._id as string )
    }
    setValue("description", event.description)
    setValue("startDate", format(toZonedTime(new Date(event.startDate), "Asia/Manila"), "yyyy-MM-dd'T'HH:mm"))
    setValue("endDate", format(toZonedTime(new Date(event.endDate), "Asia/Manila"), "yyyy-MM-dd'T'HH:mm"))
    setValue("location", event.location)
    setValue("post", (typeof event.post ==  'string' ? 
      event.post == 'true' ? true : false
      : event.post) )
    setIsUpdating(true)
    setShowModal(true)
  }

  const handleDeleteEvent = async (event: EventType) => {
    try {
      await deleteEvent(event._id!)
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      })
      await deleteObject(ref(Storage, event.imgUrl))
      await fetchEvents()
    } catch (err) {
      console.error("Error deleting event:", err)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  const resetForm = () => {
    reset()
    setImage(null)
    setIsUpdating(false)
    setSelectedEvent(null)
  }

  
  return (
    <div className="relative min-h-full min-w-full bg-[#4A1515]">
      <div className="absolute mt-8 left-8">
        <button
          onClick={() => {
            navigate("/admin")
          }}
          className="flex items-center text-white hover:opacity-80"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Admin</span>
        </button>
      </div>

      <div className="p-8 mx-auto max-w-7xl">
        <div className="float-right text-center">
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-red-600 hover:bg-red-500"
          >
            Create New Event
          </Button>
        </div>

        <h2 className="mt-16 text-2xl font-bold text-white">All Events</h2>
        <div className="overflow-x-auto mt-4 bg-[#3D0000] p-4 rounded-lg">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-700">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">
                    {format(toZonedTime(new Date(event.startDate), "Asia/Manila"), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="p-3">
                    {format(toZonedTime(new Date(event.endDate), "Asia/Manila"), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" onClick={() => handleViewEvent(event)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateEvent(event)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowDeleteConfirm(true)
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[625px] ">
            <DialogHeader>
              <DialogTitle>
                {isUpdating ? "Update Event" : selectedEvent && !isUpdating ? "View Event" : "Create New Event"}
              </DialogTitle>
              <DialogDescription>
                {isUpdating
                  ? `Make changes to your event here. Click save when you're done.`
                  : selectedEvent && !isUpdating
                    ? "Event details"
                    : "Add a new event to your calendar."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[60vh] pr-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter event title" disabled={!!(selectedEvent && !isUpdating)} />
                    )}
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Enter event description"
                        rows={4}
                        disabled={!!(selectedEvent && !isUpdating)}
                      />
                    )}
                  />
                </div>

                <div className="grid items-center grid-cols-4 gap-4">
                    <Label htmlFor="edit-hospital" className="text-right">
                      Hospital
                    </Label>
                    <Controller
                      name="hospital"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} >
                          <SelectTrigger className="col-span-3">
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
                      )}
                    />
                  </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="startDate">Start Date and Time</Label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="datetime-local" disabled={!!(selectedEvent && !isUpdating)} />
                    )}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="endDate">End Date and Time</Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="datetime-local" disabled={!!(selectedEvent && !isUpdating)} />
                    )}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter event location"
                        disabled={!!(selectedEvent && !isUpdating)}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="post">Post to Website Announcements</Label>
                  <Controller
                    name="post"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!!(selectedEvent && !isUpdating)}
                      />
                    )}
                  />
                </div>
                {(isUpdating || !selectedEvent) && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="image">Event Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                )}

                {selectedEvent && selectedEvent.imgUrl && (
                  <div className="mt-4">
                    <img
                      src={selectedEvent.imgUrl || "/placeholder.svg"}
                      alt={selectedEvent.title}
                      className="object-cover w-full h-48 rounded-md"
                    />
                  </div>
                )}

                {error && <div className="text-red-500">{error}</div>}
              </form>
            </ScrollArea>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>

              {(isUpdating || !selectedEvent) && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}
                  className="bg-[#8B4F4F] hover:bg-[#724141] text-white"
                >
                  {isLoading ? "Uploading..." : isUpdating ? "Update" : "Save to Calendar"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => selectedEvent && handleDeleteEvent(selectedEvent)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  )
}

export default EventsPage

  